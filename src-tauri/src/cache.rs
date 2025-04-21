use chrono::{DateTime, TimeZone, Utc};
use coingecko::{params::OhlcDays, CoinGeckoClient};
use coinpaprika_api::client::Client;
use once_cell::sync::Lazy;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;

use serde::{Deserialize, Serialize};

use crate::{auth::get_api_key, firebase::Portfolio, HistoricalData};

#[derive(Serialize, Deserialize)]
pub struct CoinPrice {
    pub symbol: String,
    pub price: f64,
}

#[derive(Debug, Clone, Serialize)]
pub struct StockCandle {
    pub date: DateTime<Utc>,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
}

// Šeit glabājas visi keši

pub static BALANCE_CACHE: Lazy<Arc<Mutex<HashMap<String, f64>>>> =
    Lazy::new(|| Arc::new(Mutex::new(HashMap::new())));

pub static PRICE_CACHE: Lazy<Arc<Mutex<HashMap<String, Vec<StockCandle>>>>> =
    Lazy::new(|| Arc::new(Mutex::new(HashMap::new())));

pub static HISTORICAL_TICK_CACHE: Lazy<Arc<Mutex<HashMap<String, Vec<HistoricalData>>>>> =
    Lazy::new(|| Arc::new(Mutex::new(HashMap::new())));

pub static PORTFOLIO_CACHE: Lazy<Arc<Mutex<HashMap<String, Portfolio>>>> =
    Lazy::new(|| Arc::new(Mutex::new(HashMap::new())));

// Izmanto lai ielasītu svaigus datus ik pēc 5 min (jo tik ilgi jāgaida līdz API vispār ir kaut ko varbūt atjaunojis)
pub async fn start_background_updater() {
    let cache_clone = Arc::clone(&PRICE_CACHE);

    // Bez pauzes (pirmais pieprasījums)
    let initial_prices = fetch_prices(false).await;
    {
        let mut cache = cache_clone.lock().await;
        *cache = initial_prices;
        println!("Initial price cache populated.");
    }

    // 5 min delay līdz nākamajam un tā uz rinķi
    tokio::spawn(async move {
        loop {
            let prices = fetch_prices(true).await;
            let mut cache = cache_clone.lock().await;
            *cache = prices;
            println!("Price cache updated.");
        }
    });
}

static COINS: &[(&str, &str)] = &[
    ("bitcoin", "BTC"),
    ("ethereum", "ETH"),
    ("tether", "USDT"),
    ("ripple", "XRP"),
    ("binancecoin", "BNB"),
    ("solana", "SOL"),
    ("usd-coin", "USDC"),
    ("cardano", "ADA"),
    ("dogecoin", "DOGE"),
    ("tron", "TRX"),
];

pub async fn fetch_prices(with_delay: bool) -> HashMap<String, Vec<StockCandle>> {
    if with_delay {
        tokio::time::sleep(std::time::Duration::from_secs(300)).await;
    }

    let api_key = match get_api_key("COINGECKO_API_KEY") {
        Some(key) => key,
        None => {
            println!("Missing COINGECKO_API_KEY");
            return HashMap::new();
        }
    };

    let client = CoinGeckoClient::new_with_demo_api_key(&api_key);
    let mut result = HashMap::new();

    // Manā gadījumā 10 coini, bet var vairāk. Ar bezmaksas API atslēgu man liekas tikai 60 pieprasījumus minūtē var taisīt un neatbalsta vairākus reizē.
    for (id, symbol) in COINS {
        match client.coin_ohlc(id, "eur", OhlcDays::OneDay).await {
            Ok(candles) => {
                // Dati atnāk vektorā, bet cache viņi glabājas kā vairāki vektori iekša vektorā
                let candles: Vec<StockCandle> = candles
                    .into_iter()
                    .filter_map(|v| {
                        if v.len() == 5 {
                            let timestamp = v[0] as i64 / 1000;
                            let date = Utc.timestamp_opt(timestamp, 0).single()?;
                            Some(StockCandle {
                                date,
                                open: v[1],
                                high: v[2],
                                low: v[3],
                                close: v[4],
                            })
                        } else {
                            None
                        }
                    })
                    .collect();

                if !candles.is_empty() {
                    result.insert(symbol.to_string(), candles);
                } else {
                    println!("No OHLC data for {}", symbol);
                }
            }
            Err(e) => {
                println!("Error fetching {}: {:?}", symbol, e);
            }
        }
    }

    println!("Finished fetching full OHLC data.");
    result
}

// !!! Nedrīkst pārsniegt 60 requestus stundā !!!
pub async fn get_historical_ticks(
    coin_ids: Vec<String>,
    start: String,
    interval: String,
) -> Result<HashMap<String, Vec<HistoricalData>>, String> {
    let mut result_map: HashMap<String, Vec<HistoricalData>> = HashMap::new();

    for coin_id in coin_ids.iter() {
        let key = format!("{coin_id}:{interval}:{start}");

        let data = {
            let cache = HISTORICAL_TICK_CACHE.lock().await;
            cache.get(&key).cloned()
        };

        let historical_data = match data {
            // Ja ir iekešots paņem jau to
            Some(cached) => cached,
            None => {
                // Šis ir jau CoinPaprika API, kuram nevajag API atslēgu bet 60 requesti stundā var tikai, tāpēc ar ši pieprasu smagākos datus un tikai vienreiz visas lietotnes laikā, jo pārējos gadījumos iekešots
                let client = Client::new();
                let fetched = client
                    .historical_ticks(coin_id)
                    .start(&start)
                    .interval(&interval)
                    .limit(30)
                    .send()
                    .await;

                match fetched {
                    Ok(data) => {
                        // Saliek pēdējos 30 ierakstus katrai padotajai kriptovalutai iekšā kešā
                        let converted_data: Vec<HistoricalData> = data
                            .into_iter()
                            .map(|tick| HistoricalData {
                                timestamp: tick.timestamp,
                                price: tick.price,
                            })
                            .collect();

                        let mut cache = HISTORICAL_TICK_CACHE.lock().await;
                        cache.insert(key.clone(), converted_data.clone());

                        converted_data
                    }
                    Err(e) => {
                        return Err(format!("Error: {:?}", e));
                    }
                }
            }
        };

        result_map.insert(coin_id.to_uppercase(), historical_data);
    }

    Ok(result_map)
}

pub async fn get_coins_data() -> Result<HashMap<String, Vec<StockCandle>>, String> {
    let cache = PRICE_CACHE.lock().await;

    if cache.is_empty() {
        Err("The cache is currently empty.".to_string())
    } else {
        Ok(cache.clone())
    }
}

pub async fn get_user_balance(local_id: String) -> Result<f64, String> {
    println!("Received request for user balance");

    let cache = BALANCE_CACHE.lock().await;

    match cache.get(&local_id) {
        Some(balance) => Ok(*balance),
        None => Err(format!("Balance not found for user ID: {}", local_id)),
    }
}

pub async fn get_cached_user_portfolio(uid: &str) -> Option<Portfolio> {
    let cache = PORTFOLIO_CACHE.lock().await;
    cache.get(uid).cloned()
}

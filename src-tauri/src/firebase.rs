use chrono::{DateTime, Local, NaiveDate, Utc};
use firebase_rs::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::cache::{BALANCE_CACHE, PORTFOLIO_CACHE};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub name: String,
    pub lastname: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Trade {
    pub crypto_name: String,
    pub amount: f64,
    pub action: String,
    pub price: f64,
    pub timestamp: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Balance {
    pub balance: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Portfolio {
    pub btc: f64,
    pub eth: f64,
    pub usdt: f64,
    pub xrp: f64,
    pub bnb: f64,
    pub sol: f64,
    pub usdc: f64,
    pub ada: f64,
    pub doge: f64,
    pub trx: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PortfolioWrapper {
    pub portfolio: Portfolio,
}

#[derive(Debug, Serialize, Deserialize)]
struct BalanceDate {
    daily_balance: String,
}

// Šo vajag jo CoinPaprika debils mismatch kriptovalūtu ID
impl Portfolio {
    pub fn get(&self, coin: &str) -> Result<f64, String> {
        match coin {
            "BTC" => Ok(self.btc),
            "ETH" => Ok(self.eth),
            "USDT" => Ok(self.usdt),
            "XRP" => Ok(self.xrp),
            "BNB" => Ok(self.bnb),
            "SOL" => Ok(self.sol),
            "USDC" => Ok(self.usdc),
            "ADA" => Ok(self.ada),
            "DOGE" => Ok(self.doge),
            "TRX" => Ok(self.trx),
            _ => Err(format!("Unsupported coin: {}", coin)),
        }
    }

    pub fn set(&mut self, coin: &str, value: f64) -> Result<(), String> {
        match coin {
            "BTC" => self.btc = value,
            "ETH" => self.eth = value,
            "USDT" => self.usdt = value,
            "XRP" => self.xrp = value,
            "BNB" => self.bnb = value,
            "SOL" => self.sol = value,
            "USDC" => self.usdc = value,
            "ADA" => self.ada = value,
            "DOGE" => self.doge = value,
            "TRX" => self.trx = value,
            _ => return Err(format!("Unsupported coin: {}", coin)),
        }
        Ok(())
    }
}

// User CRUD operācijas

pub async fn set_user(firebase_client: &Firebase, user: &User, local_id: &String) -> User {
    let mut firebase = firebase_client.at("users");
    let user = firebase.set_with_key::<User>(local_id, user).await;
    let user_data: User = string_to_user(&user.unwrap().data);
    return user_data;
}

pub async fn get_user(firebase_client: &Firebase, id: &String) -> User {
    let firebase = firebase_client.at("users").at(id);
    let user = firebase.get::<User>().await;
    return user.unwrap();
}

pub async fn update_user(firebase_client: &Firebase, id: &String, user: &User) -> User {
    let firebase = firebase_client.at("users").at(id);
    let _user = firebase.update::<User>(user).await;
    return string_to_user(&_user.unwrap().data);
}

pub async fn get_user_balance(firebase_client: &Firebase, id: &String) -> Result<f64, String> {
    let firebase = firebase_client.at("balance").at(id);
    let current_balance = firebase
        .get::<Balance>()
        .await
        .map_err(|e| format!("Failed to fetch balance: {:?}", e))?;
    Ok(current_balance.balance)
}

pub async fn set_user_balance(firebase_client: &Firebase, balance: &f64, local_id: &String) -> f64 {
    let mut firebase = firebase_client.at("balance").at(&local_id);
    let result = firebase.set_with_key::<f64>("balance", balance).await;
    let balance_data = result.unwrap();
    let parsed_balance: f64 = string_to_float(&balance_data.data);
    let mut cache = BALANCE_CACHE.lock().await;
    cache.insert(local_id.clone(), parsed_balance);

    parsed_balance
}

pub async fn set_daily_balance(firebase_client: &Firebase, local_id: &String) -> Option<NaiveDate> {
    let today: NaiveDate = Local::now().date_naive();
    let mut firebase = firebase_client.at("daily_balance").at(local_id);

    let result = firebase
        .set_with_key("daily_balance", &today.to_string())
        .await;

    match result {
        Ok(_res) => Some(today),
        Err(_e) => None,
    }
}

pub async fn check_daily_balance(firebase_client: &Firebase, id: &String) -> Result<bool, String> {
    let firebase = firebase_client.at("daily_balance").at(id);

    let raw_data_result = firebase.get::<BalanceDate>().await;

    match raw_data_result {
        Ok(date_str) => {
            let converted_string = date_str.daily_balance;

            // Izparso datumu uz yyyy-mm-dd
            let stored_date = NaiveDate::parse_from_str(&converted_string, "%Y-%m-%d")
                .map_err(|e| format!("Date parse error: {:?}", e))?;

            let today = Local::now().date_naive();

            if stored_date == today {
                println!("Balance already set for today.");
                Ok(false)
            } else {
                println!("Balance hasn't been added today.");
                Ok(true)
            }
        }
        Err(err) => {
            println!("No existing balance or failed to fetch. Error: {:?}", err);
            Ok(true)
        }
    }
}

pub async fn add_daily_balance(
    firebase_client: &Firebase,
    uid: &String,
    value: &f64,
) -> Result<f64, String> {
    let mut daily_balance_ref = firebase_client.at("daily_balance").at(uid);
    let mut balance_ref = firebase_client.at("balance").at(uid);

    let raw_data_result = daily_balance_ref.get::<BalanceDate>().await;

    let can_add = match raw_data_result {
        Ok(date_str) => {
            let converted_string = date_str.daily_balance;

            let stored_date = NaiveDate::parse_from_str(&converted_string, "%Y-%m-%d")
                .map_err(|e| format!("Date parse error: {:?}", e))?;

            let today = Local::now().date_naive();

            // Ja šodien jau ir paņemts daily bonus tad atgriež false ja neeksistē tabula vai ir datums kas ir atšķirīgs no šodienas tad false
            if stored_date == today {
                false
            } else {
                true
            }
        }
        Err(err) => {
            println!("No existing balance or failed to fetch. Error: {:?}", err);
            true // Nav labākā prakse bet vismaz strādā.
        }
    };
    // Piefetčo jaunāko balance un pievieno klāt padoto daudzumu
    if can_add {
        let current_balance_result = balance_ref
            .get::<Balance>()
            .await
            .map_err(|e| format!("Failed to fetch balance: {:?}", e))?;

        let current_balance = current_balance_result.balance;
        let new_balance = current_balance + value;

        balance_ref
            .set_with_key("balance", &new_balance)
            .await
            .map_err(|e| format!("Error saving updated balance: {:?}", e))?;

        // Updato arī datumu uz šodienas
        let today = Local::now().date_naive().to_string();

        daily_balance_ref
            .set_with_key("daily_balance", &today)
            .await
            .map_err(|e| format!("Error recording daily balance date: {:?}", e))?;

        {
            let mut cache = BALANCE_CACHE.lock().await;
            cache.insert(uid.clone(), new_balance);
        }

        // Atgriež jauno balance
        Ok(new_balance)
    } else {
        Ok(*value) // Ja kaut kas noiet greizi atgriež padoto balansu
    }
}

// Trades CRUD operācijas

pub async fn get_trades(
    firebase_client: &Firebase,
    uid: &String,
) -> Result<Vec<Trade>, Box<dyn std::error::Error>> {
    let firebase = firebase_client.at("trades").at(uid);
    let result: Result<Value, firebase_rs::RequestError> = firebase.get().await;

    match result {
        Ok(value) => {
            if value.is_null() {
                return Ok(vec![]);
            }

            let mut trades: Vec<Trade> = serde_json::from_value(value)?;
            // atgriež reversotu vektoru ar darījumiem, lai jaunākie būtu pirmie
            trades.reverse();
            Ok(trades)
        }

        Err(RequestError::NotFoundOrNullBody) => Ok(vec![]),

        Err(e) => Err(Box::new(e)),
    }
}

pub async fn get_user_portfolio(
    firebase_client: &Firebase,
    uid: &String,
) -> Result<Portfolio, String> {
    let firebase = firebase_client.at("portfolio").at(uid);

    // Nedaudz bs ar šo. Viņam vajag wraperi lai vispār extraktotu vērtības, kaut kas saistīts ar nested kaut ko
    let result: Result<PortfolioWrapper, firebase_rs::RequestError> = firebase.get().await;

    let portfolio = match result {
        Ok(wrapper) => wrapper.portfolio,
        Err(firebase_rs::RequestError::NotFoundOrNullBody) => Portfolio {
            btc: 0.00,
            eth: 0.00,
            usdt: 0.00,
            xrp: 0.00,
            bnb: 0.00,
            sol: 0.00,
            usdc: 0.00,
            ada: 0.00,
            doge: 0.00,
            trx: 0.00,
        },
        Err(_) => return Err("Error getting portfolio".to_string()),
    };

    Ok(portfolio)
}

pub async fn add_trade(
    firebase_client: &Firebase,
    uid: &String,
    crypto_name: &String,
    amount: &f64,
    action: &String,
    price: &f64,
    date: &String,
) -> Result<f64, String> {
    // Strādā ar esošajiem trades, balance un portfolio
    let mut trades_ref = firebase_client.at("trades").at(uid);
    let mut balance_ref = firebase_client.at("balance").at(uid);
    let mut portfolio_ref = firebase_client.at("portfolio").at(&uid);

    let trades: Vec<Trade> = trades_ref.get::<Vec<Trade>>().await.unwrap_or_default();

    let prev_balance = balance_ref.get::<Balance>().await.unwrap();

    let result: Result<PortfolioWrapper, firebase_rs::RequestError> = portfolio_ref.get().await;

    let mut portfolio = match result {
        Ok(wrapper) => wrapper.portfolio,
        Err(firebase_rs::RequestError::NotFoundOrNullBody) => Portfolio {
            btc: 0.00,
            eth: 0.00,
            usdt: 0.00,
            xrp: 0.00,
            bnb: 0.00,
            sol: 0.00,
            usdc: 0.00,
            ada: 0.00,
            doge: 0.00,
            trx: 0.00,
        },
        Err(_) => return Err("Error getting portfolio".to_string()),
    };

    println!("Current portfolio: {:?}", portfolio);

    let total_cost = price;
    let total_amount = amount;

    // Balance maiņas atkarībā no action: buy vai sell
    let new_balance = match action.as_str() {
        "buy" => prev_balance.balance - total_cost,
        "sell" => prev_balance.balance + total_cost,
        _ => return Err("Invalid trade action".to_string()),
    };

    // Nomaina vērtību portfolio objektam uz jauno
    let prev_amount = portfolio.get(crypto_name)?;
    let new_amount_raw = match action.as_str() {
        "buy" => prev_amount + total_amount,
        "sell" => prev_amount - total_amount,
        _ => return Err("Invalid trade action".to_string()),
    };

    // Šis ir lai nebūtu gadījumi ka iekšā portfolio skatā rādītos 0.00001 kriptovalūta ar 0.00... vērtību. Šis strādā kā mini tax
    let new_amount = if (crypto_name == "DOGE" || crypto_name == "TRX") && new_amount_raw < 0.01 {
        0.0
    } else if new_amount_raw < 0.00001 {
        0.0
    } else {
        new_amount_raw
    };

    portfolio.set(crypto_name, new_amount)?;

    // Datumu parsēšana
    let parsed_date: DateTime<Utc> = match date.parse() {
        Ok(d) => d,
        Err(e) => {
            let err_msg = format!("Invalid date format: {}", e);
            println!("{}", err_msg);
            return Err(err_msg);
        }
    };

    // Izveidots jauns trade
    let new_trade_key = trades.len().to_string();
    let new_trade = Trade {
        crypto_name: crypto_name.clone(),
        amount: *amount,
        action: action.clone(),
        price: *price,
        timestamp: parsed_date,
    };

    // Šeit sākas visi inserti
    if let Err(e) = trades_ref.set_with_key(&new_trade_key, &new_trade).await {
        let err_msg = format!("Failed to save trade: {:?}", e);
        return Err(err_msg);
    }

    if let Err(e) = balance_ref.set_with_key("balance", &new_balance).await {
        let err_msg = format!("Failed to update balance: {:?}", e);
        return Err(err_msg);
    }

    if let Err(e) = portfolio_ref.set_with_key("portfolio", &portfolio).await {
        let err_msg = format!("Failed to update portfolio: {:?}", e);
        return Err(err_msg);
    }

    // Iekešotas jaunās vērtības
    {
        let mut balance_cache = BALANCE_CACHE.lock().await;
        balance_cache.insert(uid.clone(), new_balance);
    }

    {
        let mut portfolio_cache = PORTFOLIO_CACHE.lock().await;
        portfolio_cache.insert(uid.clone(), portfolio.clone());
    }

    Ok(new_balance)
}

fn string_to_user(s: &str) -> User {
    serde_json::from_str(s).unwrap()
}

fn string_to_float(s: &str) -> f64 {
    serde_json::from_str(s).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_valid_coin() {
        let p = Portfolio {
            btc: 1.0,
            eth: 0.0,
            usdt: 0.0,
            xrp: 0.0,
            bnb: 0.0,
            sol: 0.0,
            usdc: 0.0,
            ada: 0.0,
            doge: 0.0,
            trx: 0.0,
        };
        assert_eq!(p.get("BTC").unwrap(), 1.0);
    }

    #[test]
    fn test_get_invalid_coin() {
        let p = Portfolio {
            btc: 0.0,
            eth: 0.0,
            usdt: 0.0,
            xrp: 0.0,
            bnb: 0.0,
            sol: 0.0,
            usdc: 0.0,
            ada: 0.0,
            doge: 0.0,
            trx: 0.0,
        };
        assert!(p.get("INVALID").is_err());
    }

    #[test]
    fn test_set_valid_coin() {
        let mut p = Portfolio {
            btc: 0.0,
            eth: 0.0,
            usdt: 0.0,
            xrp: 0.0,
            bnb: 0.0,
            sol: 0.0,
            usdc: 0.0,
            ada: 0.0,
            doge: 0.0,
            trx: 0.0,
        };
        p.set("BTC", 2.5).unwrap();
        assert_eq!(p.btc, 2.5);
    }

    #[test]
    fn test_set_invalid_coin() {
        let mut p = Portfolio {
            btc: 0.0,
            eth: 0.0,
            usdt: 0.0,
            xrp: 0.0,
            bnb: 0.0,
            sol: 0.0,
            usdc: 0.0,
            ada: 0.0,
            doge: 0.0,
            trx: 0.0,
        };
        assert!(p.set("INVALID", 2.5).is_err());
    }
}

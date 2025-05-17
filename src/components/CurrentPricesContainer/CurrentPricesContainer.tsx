import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinData, StockCandle } from "../../interfaces/interfaces.props";
import adaIcon from "../../assets/icons/ada.webp";
import bnbIcon from "../../assets/icons/bnb.webp";
import btcIcon from "../../assets/icons/btc.webp";
import dogeIcon from "../../assets/icons/doge.webp";
import ethIcon from "../../assets/icons/eth.webp";
import solIcon from "../../assets/icons/sol.webp";
import trxIcon from "../../assets/icons/trx.webp";
import usdcIcon from "../../assets/icons/usdc.webp";
import usdtIcon from "../../assets/icons/usdt.webp";
import xrpIcon from "../../assets/icons/xrp.webp";
import { useTranslation } from "react-i18next";

// Ikonu indeksēšana izmantojot esošos prefixus kas atnak no backenda
const coinIconMap: Record<string, string> = {
  BTC: btcIcon,
  ETH: ethIcon,
  DOGE: dogeIcon,
  USDT: usdtIcon,
  XRP: xrpIcon,
  BNB: bnbIcon,
  SOL: solIcon,
  USDC: usdcIcon,
  ADA: adaIcon,
  TRX: trxIcon,
};

export const CurrentPricesContainer = () => {
  const [coinData, setCoinData] = useState<CoinData | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const navigation = useNavigate();

  useEffect(() => {
    const getPrices = async () => {
      try {
        const data: CoinData = await invoke("get_coins_data", {
          symbols: [
            "BTC",
            "ETH",
            "DOGE",
            "USDT",
            "XRP",
            "BNB",
            "SOL",
            "USDC",
            "ADA",
            "TRX",
          ],
        });

        setCoinData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setError("Failed to load coin data. Please try again later.");
        setLoading(false);
      }
    };

    getPrices();
  }, []);

  const getDifference = (candle: StockCandle) => {
    const open = candle.open;
    const close = candle.close;
    return ((close - open) / open) * 100;
  };

  return (
    <div className="w-full h-full p-4 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-y-auto overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">{t("stock_prices")}</h2>
      {/* shimmeris */}
      <div className="flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse"
            >
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/5 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-500 rounded" />
              </div>
              <div className="h-5 w-[15%] bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          ))
        ) : error && coinData === undefined ? (
          <div className="p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-xl">
            <p>{error}</p>
          </div>
        ) : coinData ? (
          Object.entries(coinData).map(([coinSymbol, candles]) => {
            // Katram lai pārbaudītu kāds cenu pieaugums vai kritums papildus notiek kalkulācijas ar pēdējā candle atribūtiem
            const latestCandle = candles[candles.length - 1];
            const diff = getDifference(latestCandle);
            const isPositive = diff >= 0;
            const diffColor = isPositive ? "text-green-500" : "text-red-500";
            const arrow = isPositive ? "↑" : "↓";

            return (
              <div
                key={coinSymbol}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md cursor-pointer min-w-[250px] hover:scale-[1.02] transition-transform duration-300"
                onClick={() => {
                  sessionStorage.setItem("selectedCoin", coinSymbol);
                  navigation("/bitquest/trade");
                }}
              >
                <img
                  src={coinIconMap[coinSymbol]}
                  alt={coinSymbol}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="text-lg font-semibold">{coinSymbol}</div>
                  <div className="text-sm">
                    {t("price")}: ${latestCandle.close.toFixed(2)}
                  </div>
                </div>

                <div className={`text-lg font-bold ${diffColor}`}>
                  {arrow} {Math.abs(diff).toFixed(2)}%
                </div>
              </div>
            );
          })
        ) : null}
      </div>
    </div>
  );
};

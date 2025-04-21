import { useEffect, useState } from "react";
import { PortfolioPerformanceChart } from "../components/LineChart/LineChart";
import { PortfolioItem } from "../components/PortfolioItems/PortfolioItems";
import { invoke } from "@tauri-apps/api";
import { useAuth } from "../AuthContext";
import { useBalance } from "../BalanceContext";
import { PortfolioItemSkeleton } from "../components/PortfolioItems/PortfolioItemSkeleton";
import {
  CoinData,
  HistoricalTick,
  PortfolioCoinAmount,
} from "../interfaces/interfaces.props";
import { useTranslation } from "react-i18next";

const coinIdMap: Record<string, string> = {
  BTC: "btc-bitcoin",
  ETH: "eth-ethereum",
  USDT: "usdt-tether",
  XRP: "xrp-xrp-token",
  BNB: "bnb-binance-coin",
  SOL: "sol-solana",
  USDC: "usdc-usd-coin",
  ADA: "ada-cardano",
  DOGE: "doge-dogecoin",
  TRX: "trx-tron",
};

export const PortfolioView = () => {
  const [coinHistory, setCoinHistory] = useState<
    Record<string, HistoricalTick[]>
  >({});
  const { t } = useTranslation();
  const { setCoinData } = useBalance();
  const [activeCoin, setActiveCoin] = useState<string>("none");
  const [portfolio, setPortfolio] = useState<PortfolioCoinAmount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { coinData } = useBalance();
  const { email, password } = useAuth();

  const getCurrentCoinPrice = (symbol: string) => {
    return coinData?.[symbol]?.[0]?.close ?? 0;
  };

  const handleCoinChange = (selectedCoin: string) => {
    setActiveCoin(selectedCoin);
  };

  useEffect(() => {
    if (!email || !password) return;

    setLoading(true);
    setError(null); // Clear previous error

    const getPortfolio = async () => {
      try {
        const data: string = await invoke("get_user_portfolio", {
          email,
          password,
        });

        if (data.trim() === "{}") {
          setError("Your portfolio is currently empty.");
          setPortfolio([]);
          setLoading(false);
          return;
        }

        // Izparsē datus un no tiem uztaisa array ar kriptovalūtas nosaukumu un daudzumu (savādāk portfolio glabājas ar 10 parametriem, kurus mums iespējams vispār nevajag)
        const result = JSON.parse(data);

        if (result && typeof result === "object") {
          const filtered: PortfolioCoinAmount[] = Object.entries(result)
            .filter(([, value]) => value !== 0)
            .map(([coin, value]) => ({
              coin: coin.toUpperCase(),
              value: Number(value),
            }));

          if (filtered.length === 0) {
            setError("Your portfolio is currently empty.");
            setPortfolio([]);
            setLoading(false);
            return;
          }

          setPortfolio(filtered);

          // Extracto coinu atslēgas
          const ownedSlugs = filtered
            .map((item) => coinIdMap[item.coin])
            .filter(Boolean);

          const fetchHistoricalData = async () => {
            try {
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - 30);
              const ret_date = startDate.toISOString().split("T")[0];

              const json = await invoke<string>("get_historical_ticks", {
                coinIds: ownedSlugs,
                start: ret_date,
                interval: "1d",
              });

              const parsed: Record<string, HistoricalTick[]> = JSON.parse(json);
              setCoinHistory(parsed);
            } catch (err) {
              console.error("Error fetching historical data:", err);
              setError("Failed to load historical data.");
            } finally {
              setLoading(false);
            }
          };

          fetchHistoricalData();
        } else {
          setError("Invalid portfolio data.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setError("Error retrieving portfolio.");
        setLoading(false);
      }
    };

    getPortfolio();
  }, [email, password]);

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
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    getPrices();
  }, [setCoinData]);

  return (
    <div className="flex flex-col overflow-hidden bg-white dark:bg-gray-800 overflow-x-auto">
      <div className="flex flex-1 overflow-x-auto bg-gray-100 dark:bg-gray-700">
        <div className="flex flex-col gap-4 p-4 overflow-y-auto w-full bg-gray-200 dark:bg-gray-800 m-4 rounded-lg min-w-[515px]">
          <div className="text-3xl font-bold mb-4 p-4">
            {t("value")}:{" "}
            {/* Iziet caur visiem portfolio coiniem un izrēķina kopēju cenu */}
            {portfolio
              .reduce(
                (acc, item) =>
                  acc + getCurrentCoinPrice(item.coin) * item.value,
                0
              )
              .toFixed(2)}
            $
          </div>

          {error ? (
            <div
              className={`p-4 rounded-xl ${
                error === "Your portfolio is currently empty."
                  ? "text-xl"
                  : "text-lg"
              } ${
                error.includes("Failed") || error.includes("Error")
                  ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
            >
              <p>{error}</p>
            </div>
          ) : loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <PortfolioItemSkeleton key={i} />
            ))
          ) : (
            portfolio.map((item) => (
              <PortfolioItem
                onPriceChange={handleCoinChange}
                key={item.coin}
                name={item.coin}
                price={getCurrentCoinPrice(item.coin) * item.value}
                amount={item.value}
              />
            ))
          )}
        </div>
        <PortfolioPerformanceChart
          activeCoin={activeCoin}
          onSelectCoin={handleCoinChange}
          values={
            activeCoin != "none"
              ? coinHistory[coinIdMap[activeCoin].toUpperCase()]
              : []
          }
        />
      </div>
    </div>
  );
};

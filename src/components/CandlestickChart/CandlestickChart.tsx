import { useEffect, useState } from "react";
import { Chart } from "./Chart";
import { Prices } from "./Prices";
import { invoke } from "@tauri-apps/api";
import { ICandleStickChartProps } from "./CandlestickChart.props";
import { useBalance } from "../../BalanceContext";
import { CoinData, StockCandle } from "../../interfaces/interfaces.props";

export const CandleStickChart = (props: ICandleStickChartProps) => {
  const { activeCoin } = props;
  const { coinData, setCoinData } = useBalance();
  const [activeCandle, setActiveCandle] = useState<StockCandle | undefined>();
  const [visibleCount, setVisibleCount] = useState<number>(20);

  // Padod daudzumu cik nepieciešams attēlot
  const filteredCandles = (() => {
    if (!coinData?.[activeCoin]) return [];
    return coinData[activeCoin].slice(-visibleCount);
  })();

  // Datu ievāksāna
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
        setActiveCandle(data?.["BTC"]?.[0]);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    getPrices();
  }, [setCoinData]);

  useEffect(() => {
    if (coinData?.[activeCoin]?.length) {
      setActiveCandle(coinData[activeCoin][0]);
    }
  }, [activeCoin, coinData, filteredCandles.length]);

  // Dabu augstāko vērtību priekš candlestick čarta dimensiju aprēķināšanas
  const getDomain = (candles: StockCandle[]): [number, number] | undefined => {
    const values = candles.map(({ high, low }) => [high, low]).flat();
    return [Math.min(...values), Math.max(...values)];
  };

  // Nomainoties svecītei nomainas cena kas tiek parādīta
  const handlePriceChange = (newPrice: StockCandle) => {
    setActiveCandle(newPrice);
  };
  return (
    <div className="flex flex-col flex-3 h-auto w-auto">
      <Prices
        candle={activeCandle}
        visibleCount={visibleCount}
        setVisibleCount={setVisibleCount}
      />
      <Chart
        candles={filteredCandles}
        domain={getDomain(filteredCandles)}
        onCandleChange={handlePriceChange}
      />
    </div>
  );
};

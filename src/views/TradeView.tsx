import { useCallback, useEffect, useState } from "react";
import { CandleStickChart } from "../components/CandlestickChart/CandlestickChart";
import { TradesConsole } from "../components/TradesConsole/TradesConsole";
import { UserTrade } from "../components/TradesConsole/TradesConsole.props";
import { TradeBox } from "../components/TradingBox/TradeBox";
import { invoke } from "@tauri-apps/api";
import { useBalance } from "../BalanceContext";
import { useAuth } from "../AuthContext";
import {
  CoinData,
  PortfolioCoinAmount,
  StockCandle,
} from "../interfaces/interfaces.props";

export const TradeView = () => {
  const [currentTrades, setCurrentTrades] = useState<UserTrade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { email, password, localId } = useAuth();
  const [activeCoin, setActiveCoin] = useState<string>("BTC");
  const [portfolio, setPortfolio] = useState<PortfolioCoinAmount[]>([]);
  const [coinData, setCoinData] = useState<CoinData | undefined>();
  const [activeCandle, setActiveCandle] = useState<StockCandle | undefined>();
  const { balance, setBalance } = useBalance();

  const handleTrade = useCallback(
    async (
      email: string,
      password: string,
      cryptoName: string,
      amount: number,
      action: string,
      price: number,
      date: Date
    ) => {
      try {
        const response: number = await invoke("add_user_trade", {
          email: email,
          password: password,
          cryptoName: cryptoName,
          amount: amount,
          action: action,
          price: price,
          date: date.toISOString(),
        });
        console.log(
          "Successfully created a trade. Current balance: " + response
        );
        setBalance(response);
      } catch (error) {
        console.error(error);
      }
    },
    [setBalance]
  );

  const changeActiveCoin = (coinName: string) => {
    setActiveCoin(coinName);
  };

  useEffect(() => {
    const get_balance = async () => {
      try {
        const response: number = await invoke("get_user_balance", {
          localId: localId,
        });
        setBalance(response);
        console.log("We got the balance: " + response);
      } catch (error) {
        console.error("Error getting balance: ", error);
      }
    };
    get_balance();
  }, [localId, setBalance]);

  useEffect(() => {
    const getCurrentTrades = async () => {
      setIsLoading(true);

      try {
        const response: string = await invoke("get_user_trades", {
          email: email,
          password: password,
        });

        try {
          const parsedData: UserTrade[] = JSON.parse(response);
          setCurrentTrades(parsedData);
        } catch (parseError) {
          console.error("Error parsing trades data:", parseError);
        }
      } catch (error) {
        console.error("Error fetching trades data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentTrades();
  }, [email, password, handleTrade, balance]);

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
  }, []);

  useEffect(() => {
    if (!email || !password) return;

    const getPortfolio = async () => {
      try {
        const data: string = await invoke("get_user_portfolio", {
          email,
          password,
        });

        if (data.trim() === "{}") {
          setPortfolio([]);
          return;
        }

        // Izparso portfolio un uztaisa par izmantojamu objektu
        const result = JSON.parse(data);

        if (result && typeof result === "object") {
          const filtered: PortfolioCoinAmount[] = Object.entries(result)
            .filter(([, value]) => value !== 0)
            .map(([coin, value]) => ({
              coin: coin.toUpperCase(),
              value: Number(value),
            }));

          if (filtered.length === 0) {
            setPortfolio([]);
            return;
          }

          setPortfolio(filtered);
        }
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    getPortfolio();
  }, [email, password]);

  useEffect(() => {
    if (coinData && activeCoin in coinData) {
      const firstCandle = coinData[activeCoin]?.[0];
      setActiveCandle(firstCandle);
    }
  }, [coinData, activeCoin]);

  return (
    <>
      <div className="h-full grid grid-rows-[1fr_16rem] gap-4 bg-gray-100 dark:bg-gray-700 p-4">
        <div className="flex flex-col sm:flex-row flex-1 gap-2 bg-gray-100 dark:bg-gray-700">
          <CandleStickChart activeCoin={activeCoin} />
          <TradeBox
            changeActiveCoin={changeActiveCoin}
            firstCandle={activeCandle}
            portfolio={portfolio}
          />
        </div>
        <TradesConsole trades={currentTrades} isLoading={isLoading} />
      </div>
    </>
  );
};

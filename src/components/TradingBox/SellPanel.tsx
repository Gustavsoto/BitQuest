import { useCallback, useEffect, useState } from "react";
import {
  ISellPanelProps,
  PortfolioCoinAmount,
} from "../../interfaces/interfaces.props";
import { invoke } from "@tauri-apps/api";
import { useBalance } from "../../BalanceContext";
import { useAuth } from "../../AuthContext";
import { useTranslation } from "react-i18next";
import { SellPanelShimmer } from "./SellPanelShimmer";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

export const SellPanel = (props: ISellPanelProps) => {
  const [portfolioLoading, setPortfolioLoading] = useState<boolean>(true);
  const { currentValue, changeActiveCoin } = props;
  const { setBalance } = useBalance();
  const { email, password } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioCoinAmount[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>(
    portfolio.length > 0 ? portfolio[0].coin : "BTC"
  );
  const [amount, setAmount] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [payoutMax, setPayoutMax] = useState<number>(0);
  const [customPayout, setCustomPayout] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);
  const { t } = useTranslation();

  const getPortfolio = useCallback(async () => {
    try {
      setPortfolioLoading(true);
      const data: string = await invoke("get_user_portfolio", {
        email,
        password,
      });

      if (data.trim() === "{}") {
        setPortfolio([]);
        return;
      }

      const result = JSON.parse(data);

      if (result && typeof result === "object") {
        const filtered: PortfolioCoinAmount[] = Object.entries(result)
          .filter(([, value]) => value !== 0)
          .map(([coin, value]) => ({
            coin: coin.toUpperCase(),
            value: Number(value),
          }));

        setPortfolio(filtered);
      }
    } catch (error) {
      console.error("Error fetching coin data:", error);
    } finally {
      setPortfolioLoading(false);
    }
  }, [email, password]);

  useEffect(() => {
    console.log("This is being called3");
    getPortfolio();
  }, [getPortfolio]);

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
      console.log("This is being called");
      setIsLoading(true);
      try {
        const response: number = await invoke("add_user_trade", {
          email,
          password,
          cryptoName,
          amount,
          action,
          price,
          date: date.toISOString(),
        });
        console.log(
          "Successfully created a trade. Current balance: " + response
        );
        setBalance(response);
        setCustomPayout(0);
        setAmount(0);
        setError("");
        getPortfolio();
      } catch (error) {
        console.error(error);
        setError("Something went wrong while processing the trade.");
      } finally {
        setIsLoading(false);
      }
    },
    [setBalance, getPortfolio]
  );

  useEffect(() => {
    if (
      portfolio.length > 0 &&
      currentValue !== undefined &&
      !portfolio.find((c) => c.coin === selectedCoin)
    ) {
      const firstCoin = portfolio[0];
      changeActiveCoin(firstCoin.coin);
      setSelectedCoin(firstCoin.coin);
      setMaxValue(firstCoin.value);
      setPayoutMax(firstCoin.value * currentValue);
    } else if (selectedCoin && currentValue !== undefined) {
      const coinData = portfolio.find((c) => c.coin === selectedCoin);
      if (coinData) {
        setMaxValue(coinData.value);
        setPayoutMax(coinData.value * currentValue);
      }
    }
  }, [portfolio, currentValue, selectedCoin, changeActiveCoin]);

  const changeCoin = (name: string) => {
    changeActiveCoin(name);
    setSelectedCoin(name);
    setCustomPayout(0);
    setAmount(0);
    setError("");
  };

  const handleCustomPayoutChange = (value: number) => {
    if (currentValue === undefined) return;

    setCustomPayout(value);

    if (value > payoutMax) {
      setError("Payout exceeds your available balance.");
      setAmount(0);
    } else {
      setError("");
      setAmount(Number((value / currentValue).toFixed(8)));
    }
  };

  return (
    <>
      {portfolioLoading ? (
        <SellPanelShimmer />
      ) : portfolio.length === 0 ? (
        <div>{t("no_assets")}</div>
      ) : currentValue === undefined ? (
        <div></div>
      ) : (
        <>
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {t("coin_name")}
          </label>
          <select
            value={selectedCoin}
            onChange={(e) => changeCoin(e.target.value)}
            disabled={isLoading}
            className="w-full px-2 py-1 border rounded mb-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            {portfolio.map((coin) => (
              <option
                key={coin.coin}
                value={coin.coin}
                className="dark:bg-gray-800 dark:text-gray-100"
              >
                {coin.coin}
              </option>
            ))}
          </select>

          <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {t("payout_amount")}
          </label>
          <div className="flex items-center g-2">
            <div className="relative w-full">
              <input
                type="number"
                min="0"
                max={payoutMax}
                step="1"
                value={customPayout === 0 ? "" : customPayout}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setCustomPayout(0);
                    setAmount(0);
                    setError("");
                  } else {
                    handleCustomPayoutChange(Number(val));
                  }
                }}
                className="w-full px-8 py-1 border rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                disabled={isLoading}
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 pointer-events-none">
                $
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-1">
            {t("max_payout")}: <strong>${payoutMax.toFixed(4)}</strong>
          </div>
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

          <button
            disabled={maxValue <= 0 || amount === 0 || !!error || isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-3 flex items-center justify-center gap-2"
            onClick={() => setButtonPressed(true)}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("loading")}...
              </>
            ) : (
              t("confirm_sell")
            )}
          </button>
          {buttonPressed && (
            <ConfirmDialog
              message={"Are you sure you want to make this trade?"}
              onAccept={() => {
                handleTrade(
                  email,
                  password,
                  selectedCoin,
                  amount,
                  "sell",
                  customPayout,
                  new Date()
                );
                setButtonPressed(false);
              }}
              onDeny={() => setButtonPressed(false)}
              action="sell"
              payout={customPayout}
              coinName={selectedCoin}
            />
          )}
        </>
      )}
    </>
  );
};

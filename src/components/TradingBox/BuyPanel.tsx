import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useBalance } from "../../BalanceContext";
import { useAuth } from "../../AuthContext";
import { IBuyPanelProps } from "../../interfaces/interfaces.props";
import { useTranslation } from "react-i18next";

const COINS = [
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
];

export const BuyPanel = (props: IBuyPanelProps) => {
  const { changeActiveCoin, currentValue } = props;
  const { balance, setBalance } = useBalance();
  const { email, password } = useAuth();
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  const [spendAmount, setSpendAmount] = useState<number>(0);
  const [amountToBuy, setAmountToBuy] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();

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
      setIsLoading(true); // ← START loading
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
        setSpendAmount(0);
        setAmountToBuy(0);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Something went wrong while processing the trade.");
      } finally {
        setIsLoading(false); // ← END loading
      }
    },
    [setBalance]
  );

  useEffect(() => {
    changeActiveCoin(selectedCoin);
  }, [selectedCoin, changeActiveCoin]);

  const changeCoin = (name: string) => {
    setSelectedCoin(name);
    changeActiveCoin(name);
    setSpendAmount(0);
    setAmountToBuy(0);
    setError("");
  };

  const handleSpendChange = (value: number) => {
    if (!currentValue) return;

    setSpendAmount(value);

    if (value > balance) {
      setError("You don't have enough balance to complete this trade.");
      setAmountToBuy(0);
    } else {
      setError("");
      const calculated = Number((value / currentValue).toFixed(8));
      setAmountToBuy(calculated);
    }
  };

  return (
    <>
      {currentValue === undefined ? (
        <div className="text-gray-600 dark:text-gray-300">
          {t("coinprice_error")}
        </div>
      ) : (
        <>
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {t("coin_name")}
          </label>
          <select
            value={selectedCoin}
            onChange={(e) => changeCoin(e.target.value)}
            className="w-full px-2 py-1 border rounded mb-3 bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            disabled={isLoading} // Disable during loading
          >
            {COINS.map((coin) => (
              <option
                key={coin}
                value={coin}
                className="dark:bg-gray-800 dark:text-gray-100"
              >
                {coin}
              </option>
            ))}
          </select>

          <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {t("buy_price")}
          </label>
          <input
            type="number"
            min="0"
            max={balance}
            step="1"
            value={spendAmount}
            onChange={(e) => handleSpendChange(Number(e.target.value))}
            className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            disabled={isLoading} // Disable during loading
          />

          <div className="text-sm text-gray-500 mt-1">
            {t("balance")}: <strong>${balance.toFixed(2)}</strong>
          </div>

          {amountToBuy > 0 && (
            <div className="text-sm text-gray-500 mt-1">
              {t("recieve_amount")}:{" "}
              <strong>
                {amountToBuy} {selectedCoin}
              </strong>
            </div>
          )}

          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

          <button
            disabled={balance <= 0 || amountToBuy === 0 || !!error || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            onClick={() =>
              handleTrade(
                email,
                password,
                selectedCoin,
                amountToBuy,
                "buy",
                spendAmount,
                new Date()
              )
            }
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("loading")}...
              </>
            ) : (
              t("confirm_buy")
            )}
          </button>
        </>
      )}
    </>
  );
};

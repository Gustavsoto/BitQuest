import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useBalance } from "../../BalanceContext";
import { useAuth } from "../../AuthContext";
import { IBuyPanelProps } from "../../interfaces/interfaces.props";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

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
  const { changeActiveCoin, currentValue } = props; // Izvēlētā svece diagrammā un šī brīža kriptovalūtas slēgšanas cena
  const { balance, setBalance } = useBalance(); // Lietotāja bilance
  const { email, password } = useAuth();
  const defaultCoin = sessionStorage.getItem("selectedCoin") || "BTC"; // Nokausējuma vērtība iekšā kriptovalūtas izvelnē
  const [selectedCoin, setSelectedCoin] = useState<string>(defaultCoin);
  const [spendAmount, setSpendAmount] = useState<number>(0); // Darījuma naudas vērtība
  const [amountToBuy, setAmountToBuy] = useState<number>(0); // Kriptovalūtu daudzums darījumam
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);
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

  // Maina izvelnes izvēlēto vērtību
  const changeCoin = (name: string) => {
    setSelectedCoin(name);
    changeActiveCoin(name);
    setSpendAmount(0);
    setAmountToBuy(0);
    setError("");
  };

  // Kļūdu pārbaude tam vai var atļauties šādu darījumu
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
      {/* Kļūdas paziņojums */}
      {currentValue === undefined ? (
        <div className="text-gray-600 dark:text-gray-300">
          {t("coinprice_error")}
        </div>
      ) : (
        <>
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {t("coin_name")}
          </label>
          {/* Kriptovalūtu izvelne */}
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
          <div className="relative w-full">
            <input
              type="number"
              min="0"
              max={balance}
              step="1"
              value={spendAmount === 0 ? "" : spendAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setSpendAmount(0);
                  setAmountToBuy(0);
                  setError("");
                } else {
                  const numberVal = Number(val);
                  handleSpendChange(numberVal);
                }
              }}
              className="w-full px-8 py-1 border rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              disabled={isLoading}
            />
            {/* Naudas simbols pa kreisi no ievadlauka */}
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
              $
            </span>
          </div>

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
            onClick={() => setButtonPressed(true)}
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
          {/* Apstiprināšanas dialogs */}
          {buttonPressed && (
            <ConfirmDialog
              message={"Are you sure you want to make this trade?"}
              onAccept={() => {
                handleTrade(
                  email,
                  password,
                  selectedCoin,
                  amountToBuy,
                  "buy",
                  spendAmount,
                  new Date()
                );
                setButtonPressed(false);
              }}
              onDeny={() => setButtonPressed(false)}
              action="buy"
              payout={spendAmount}
              coinName={selectedCoin}
            />
          )}
        </>
      )}
    </>
  );
};

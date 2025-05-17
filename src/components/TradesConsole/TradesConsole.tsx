import { useTranslation } from "react-i18next";
import { ITradesConsoleProps } from "./TradesConsole.props";

//TODO Šis jafetcho kaut kā no datubazes

export const TradesConsole = (props: ITradesConsoleProps) => {
  const { trades, isLoading } = props;
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-hidden bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-xl pb-2">
      <div className="flex flex-col h-full">
        <div className="p-1 font-bold text-xl text-gray-800 dark:text-gray-200 ml-2 mt-2">
          {t("order")}
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse h-12 mb-2 rounded bg-gray-300 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-700"
              />
            ))
          ) : trades.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No trades were found.
            </p>
          ) : (
            trades.map((trade, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 mb-2 border-2 ${
                  trade.action !== "buy"
                    ? "bg-red-200 dark:bg-red-700 border-red-500 text-gray-800 dark:text-gray-100"
                    : "bg-green-200 dark:bg-green-800 border-green-500 text-gray-800 dark:text-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span className="font-semibold">{trade.cryptoName}</span>
                  <span className="mx-2">|</span>
                  <span>
                    {trade.amount} {trade.cryptoName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{t(trade.action)}</span>
                  <span className="text-sm">
                    @ {trade.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

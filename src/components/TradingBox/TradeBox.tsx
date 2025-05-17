import { ITradeBoxProps } from "./TradingBox.props";
import { BuyPanel } from "./BuyPanel";
import { SellPanel } from "./SellPanel";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const TradeBox = (props: ITradeBoxProps) => {
  const { changeActiveCoin, firstCandle } = props;
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const { t } = useTranslation();

  return (
    <div className="bg-gray-200 dark:bg-gray-800 flex flex-col p-4 mr-1 flex-1 rounded-xl min-w-[200px]">
      <h2 className="text-gray-800 dark:text-gray-200 text-lg font-semibold mb-4">
        {t("place_order")}
      </h2>

      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => {
            setActiveTab("buy");
          }}
          className={`flex-1 py-2 rounded-l-lg ${
            activeTab === "buy"
              ? "bg-green-600 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white"
          }`}
        >
          {t("buy")}
        </button>
        <button
          onClick={() => {
            setActiveTab("sell");
          }}
          className={`flex-1 py-2 rounded-r-lg ${
            activeTab === "sell"
              ? "bg-red-600 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white"
          }`}
        >
          {t("sell")}
        </button>
      </div>
      {/* Dynamic Form */}
      {activeTab === "buy" ? (
        <BuyPanel
          currentValue={firstCandle?.close}
          changeActiveCoin={changeActiveCoin}
        />
      ) : (
        <SellPanel
          currentValue={firstCandle?.close}
          changeActiveCoin={changeActiveCoin}
        />
      )}
    </div>
  );
};

import { useTranslation } from "react-i18next";
import { IPriceProps } from "./CandlestickChart.props";

export const Prices = (props: IPriceProps) => {
  const { candle, visibleCount, setVisibleCount } = props;
  const { t } = useTranslation();
  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    // Dati atnāk ISO formātā, tāpēc viņus izparsēju lai skaistā attēloti lietotājam
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 flex gap-8 shadow-lg items-center justify-between rounded-tr-xl rounded-tl-xl">
      <div className="flex gap-12">
        <div className="flex flex-col gap-2 text-gray-800 dark:text-gray-200">
          <div className="text-sm">
            {t("date")}:{" "}
            <span className="font-medium">
              {candle ? formatDateTime(candle.date) : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-gray-800 dark:text-gray-200">
          <div className="text-sm">
            {t("high")}:{" "}
            <span className="font-medium">{candle ? candle.high : "N/A"}</span>
          </div>
          <div className="text-sm">
            {t("low")}:{" "}
            <span className="font-medium">{candle ? candle.low : "N/A"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-gray-800 dark:text-gray-200">
          <div className="text-sm">
            {t("open")}:{" "}
            <span className="font-medium">{candle ? candle.open : "N/A"}</span>
          </div>
          <div className="text-sm">
            {t("close")}:{" "}
            <span className="font-medium">{candle ? candle.close : "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <label className="text-sm text-gray-700 dark:text-gray-300 mr-2">
          Candles:
        </label>
        <select
          value={visibleCount}
          onChange={(e) => setVisibleCount(parseInt(e.target.value))}
          className="bg-white dark:bg-gray-600 text-sm text-gray-900 dark:text-gray-100 rounded px-2 py-1"
        >
          <option value={20}>Last 20</option>
          <option value={30}>Last 30</option>
          <option value={50}>Last 50</option>
        </select>
      </div>
    </div>
  );
};

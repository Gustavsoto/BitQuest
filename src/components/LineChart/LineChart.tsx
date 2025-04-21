import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IPerformanceChartProps } from "../../interfaces/interfaces.props";
import { useTranslation } from "react-i18next";

// Konvertācija no ISO uz lasāmu formātu
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const PortfolioPerformanceChart = (props: IPerformanceChartProps) => {
  const { values, activeCoin } = props;
  const formattedValues = values.map((value) => ({
    ...value,
    timestamp: formatTimestamp(value.timestamp),
  }));
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center m-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md p-6 w-full min-w-[515px]">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
        {activeCoin == "none"
          ? t("no_coin")
          : t("historic_price") + ": " + activeCoin}
      </h2>

      <div className="w-full aspect-[16/9]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedValues}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2D3748",
                borderColor: "#4CAF50",
                color: "#F7FAFC",
              }}
              labelStyle={{ color: "#F7FAFC" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4CAF50"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

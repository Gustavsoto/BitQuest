import { useState, useEffect } from "react";
import { FiPlusCircle, FiMoon, FiSun } from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import btcIcon from "../../assets/icons/btc.webp";
import candlechartImage from "../../assets/pictures/candlechart.png";
import buyboximg from "../../assets/pictures/tradebox.png";

// Sample data
const formattedValues = [
  { datetime: "04/10/2025, 00:00", price: 81680 },
  { datetime: "04/11/2025, 00:00", price: 82366 },
  { datetime: "04/12/2025, 00:00", price: 85061 },
  { datetime: "04/13/2025, 00:00", price: 80562 },
  { datetime: "04/14/2025, 00:00", price: 81772 },
  { datetime: "04/15/2025, 00:00", price: 82146 },
  { datetime: "04/16/2025, 00:00", price: 84661 },
  { datetime: "04/17/2025, 00:00", price: 84890 },
  { datetime: "04/18/2025, 00:00", price: 82631 },
  { datetime: "04/19/2025, 00:00", price: 80137 },
  { datetime: "04/20/2025, 00:00", price: 80332 },
  { datetime: "04/21/2025, 00:00", price: 84875 },
  { datetime: "04/22/2025, 00:00", price: 85202 },
  { datetime: "04/23/2025, 00:00", price: 80666 },
  { datetime: "04/24/2025, 00:00", price: 83220 },
  { datetime: "04/25/2025, 00:00", price: 83095 },
  { datetime: "04/26/2025, 00:00", price: 82231 },
  { datetime: "04/27/2025, 00:00", price: 82825 },
  { datetime: "04/28/2025, 00:00", price: 81966 },
  { datetime: "04/29/2025, 00:00", price: 83620 },
  { datetime: "04/30/2025, 00:00", price: 83163 },
  { datetime: "05/01/2025, 00:00", price: 83231 },
  { datetime: "05/02/2025, 00:00", price: 80702 },
  { datetime: "05/03/2025, 00:00", price: 82788 },
  { datetime: "05/04/2025, 00:00", price: 84540 },
  { datetime: "05/05/2025, 00:00", price: 80735 },
  { datetime: "05/06/2025, 00:00", price: 82376 },
  { datetime: "05/07/2025, 00:00", price: 85221 },
  { datetime: "05/08/2025, 00:00", price: 82639 },
  { datetime: "05/09/2025, 00:00", price: 82064 },
];

export const FeaturesTutorial = () => {
  const [balance, setBalance] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Effect for dark mode initialization
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 min-w-[400px]">
      <h1 className="text-4xl sm:text-3xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Features of BitQuest
      </h1>

      <h2 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Latest crypto prices for today from CoinGecko!
      </h2>
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300">
        <img
          src={btcIcon}
          alt="BTC"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold">BTC</div>
          <div className="text-sm">Price: $84444</div>
        </div>
        <div className="text-lg font-bold text-green-500">↑ 30.2%</div>
      </div>

      <h2 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-8 mb-4">
        Dynamic candlestick chart with a simple price ticker near cursor!
      </h2>
      <div className="mt-8">
        <img
          src={candlechartImage}
          alt="Candle Chart"
          className="w-full rounded-xl shadow-lg"
        />
      </div>

      <h2 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-8 mb-4">
        Simple to understand tradebox for trading crypto!
      </h2>
      <div className="mt-8">
        <img
          src={buyboximg}
          alt="Trade Box"
          className="w-full rounded-xl shadow-lg"
        />
      </div>

      <h2 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-8 mb-4">
        Every trade is being registered inside trading view to keep track of
        your assets
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 mb-4 border-2 bg-green-100 dark:bg-green-800 border-green-500 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-xl">BTC</span>
            <span className="mx-2 text-sm">|</span>
            <span className="text-lg">0.5 BTC</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-lg">Buy</span>
            <span className="text-sm text-gray-600 dark:text-gray-200">
              Price: 81,680
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 mb-4 border-2 bg-red-100 dark:bg-red-700 border-red-500 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-xl">ETH</span>
            <span className="mx-2 text-sm">|</span>
            <span className="text-lg">1.2 ETH</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-lg">Sell</span>
            <span className="text-sm text-gray-600 dark:text-gray-200">
              Price: 2,236
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-4">
        Data about coin performance from the last 30 days from CoinPaprika
      </h2>
      <div className="h-80 w-full bg-white dark:bg-gray-700 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedValues}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="datetime" />
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

      <h2 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-4">
        Add 10,000 BitQuest currency to your balance every day!
      </h2>
      <div className="flex items-center gap-4 mb-4">
        <FiPlusCircle
          className="w-10 h-10 text-blue-500 cursor-pointer"
          onClick={() => setBalance(balance + 10000)}
        />
        <div className="text-lg font-semibold">{balance ? balance : 0}</div>
      </div>

      <h2 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-4">
        Cool accessibility features like dark mode and language support
      </h2>
      <div className="w-12 h-12 items-center justify-center flex hover:bg-gray-200 dark:hover:bg-gray-500 rounded-2xl transition duration-300">
        {darkMode ? (
          <FiMoon
            className="w-8 h-8 text-gray-800 dark:text-gray-100"
            onClick={toggleDarkMode}
          />
        ) : (
          <FiSun
            className="w-8 h-8 text-gray-800 dark:text-gray-100"
            onClick={toggleDarkMode}
          />
        )}
      </div>
    </div>
  );
};

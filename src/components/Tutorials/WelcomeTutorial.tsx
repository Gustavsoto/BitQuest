import btcIcon from "../../assets/icons/btc.webp";
import ethIcon from "../../assets/icons/eth.webp";
import dogeIcon from "../../assets/icons/doge.webp";
import usdtIcon from "../../assets/icons/usdt.webp";
import xrpIcon from "../../assets/icons/xrp.webp";
import bnbIcon from "../../assets/icons/bnb.webp";
import solIcon from "../../assets/icons/sol.webp";
import usdcIcon from "../../assets/icons/usdc.webp";
import adaIcon from "../../assets/icons/ada.webp";
import trxIcon from "../../assets/icons/trx.webp";

const coinMetaMap: Record<string, { icon: string; name: string }> = {
  BTC: { icon: btcIcon, name: "Bitcoin" },
  ETH: { icon: ethIcon, name: "Ethereum" },
  DOGE: { icon: dogeIcon, name: "Dogecoin" },
  USDT: { icon: usdtIcon, name: "Tether" },
  XRP: { icon: xrpIcon, name: "Ripple (XRP)" },
  BNB: { icon: bnbIcon, name: "Binance Coin" },
  SOL: { icon: solIcon, name: "Solana" },
  USDC: { icon: usdcIcon, name: "USD Coin" },
  ADA: { icon: adaIcon, name: "Cardano" },
  TRX: { icon: trxIcon, name: "Tron" },
};

export const WelcomeTutorial = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 min-w-[400px]">
      <h1 className="text-5xl sm:text-4xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        Welcome to BitQuest
      </h1>
      <p className="text-3xl sm:text-2xl md:text-xl text-gray-700 font-semibold dark:text-gray-300 mb-6 leading-relaxed text-center">
        BitQuest is a beginner-friendly platform designed to teach you the
        fundamentals of cryptocurrency and trading. Explore core blockchain
        technologies, learn how trading works, and use our paper trading tool to
        practice with real market data — all without the risk.
      </p>
      <p className="text-3xl sm:text-2xl md:text-xl text-gray-600 font-semibold dark:text-gray-400 mb-8 text-center">
        We track the latest prices for the top 10 cryptocurrencies in real time
        so you can stay informed and learn by doing.
      </p>

      <h2 className="text-3xl sm:text-2xl md:text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
        🪙 Top Cryptocurrencies on BitQuest
      </h2>

      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] justify-items-center">
        {Object.entries(coinMetaMap).map(([symbol, { icon, name }]) => (
          <div
            key={symbol}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-2xl hover:scale-[1.03] transition duration-200 min-w-[200px]"
          >
            <img
              src={icon}
              alt={name}
              className="w-14 h-14 md:w-16 md:h-16 mb-2 rounded-full object-cover"
            />
            <div className="text-lg sm:text-base md:text-sm font-medium text-gray-900 dark:text-white text-center">
              {name}
            </div>
            <div className="text-sm sm:text-xs md:text-xs text-gray-500 dark:text-gray-300">
              ({symbol})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

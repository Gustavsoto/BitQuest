import adaIcon from "../../assets/icons/ada.webp";
import bnbIcon from "../../assets/icons/bnb.webp";
import btcIcon from "../../assets/icons/btc.webp";
import dogeIcon from "../../assets/icons/doge.webp";
import ethIcon from "../../assets/icons/eth.webp";
import solIcon from "../../assets/icons/sol.webp";
import trxIcon from "../../assets/icons/trx.webp";
import usdcIcon from "../../assets/icons/usdc.webp";
import usdtIcon from "../../assets/icons/usdt.webp";
import xrpIcon from "../../assets/icons/xrp.webp";
import { IPortfolioItemProps } from "../../interfaces/interfaces.props";

const coinIconMap: Record<string, string> = {
  BTC: btcIcon,
  ETH: ethIcon,
  DOGE: dogeIcon,
  USDT: usdtIcon,
  XRP: xrpIcon,
  BNB: bnbIcon,
  SOL: solIcon,
  USDC: usdcIcon,
  ADA: adaIcon,
  TRX: trxIcon,
};

export const PortfolioItem = (props: IPortfolioItemProps) => {
  const { name, price, amount, onPriceChange } = props;

  return (
    <div
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
      onClick={() => onPriceChange(name)}
    >
      {/* Logo */}
      <img
        src={coinIconMap[name]}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Kriptovalūtas nosaukums + daudzums */}
      <div className="flex flex-1 gap-4">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </span>
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {amount}
        </span>
      </div>

      {/* Šī brīža vērtība */}
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        ${price.toFixed(2)}
      </div>
    </div>
  );
};

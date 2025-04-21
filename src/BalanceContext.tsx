import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { CoinData } from "./interfaces/interfaces.props";

// Speciali uztaisits konteksts kas pieejams tikai iekšā galvenajos ekrānos. Spēj arī saglabāt vērtības pēc reloadiem izmantojot sesijas krātuvi

type BalanceContextType = {
  balance: number;
  setBalance: (balance: number) => void;
  coinData: CoinData | undefined;
  setCoinData: (coinData: CoinData | undefined) => void;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useBalance must be used within BalanceProvider");
  return context;
};

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  // Paņem no sesijas balancu ja ir (gadījuma ja ir bijis kāds refresh)
  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = sessionStorage.getItem("balance");
    return savedBalance ? JSON.parse(savedBalance) : 0;
  });

  const [coinData, setCoinData] = useState<CoinData | undefined>(() => {
    const savedCoinData = sessionStorage.getItem("coinData");
    return savedCoinData ? JSON.parse(savedCoinData) : undefined;
  });

  // Ja tiek mainīts, automātiski ievieto sesijā jauno vērtību
  useEffect(() => {
    sessionStorage.setItem("balance", JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    if (coinData !== undefined) {
      sessionStorage.setItem("coinData", JSON.stringify(coinData));
    } else {
      sessionStorage.removeItem("coinData");
    }
  }, [coinData]);
  return (
    <BalanceContext.Provider
      value={{ balance, setBalance, coinData, setCoinData }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

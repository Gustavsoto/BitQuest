export interface User{
  name: string;
  lastname: string;
  email: string;
  password: string;
  username: string;
}

export interface AuthResult {
  idToken: string;
  localId: string;
  userInfo: User;
}

export interface StockCandle {
  date: string; // ISO string vai DateTime
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface PortfolioCoinAmount {
  coin: string;
  value: number;
}

export interface HistoricalTick {
  timestamp: string;
  price: number;
}


// Šis ir no CoinGecko
export interface CoinData {
  [coinSymbol: string]: StockCandle[];
}

export interface ISellPanelProps {
  coins: PortfolioCoinAmount[];
  currentValue: number | undefined;
  changeActiveCoin: (name: string) => void;
}

export interface IBuyPanelProps {
  currentValue: number | undefined;
  changeActiveCoin: (name: string) => void;
}

export interface IPortfolioItemProps {
  name: string;
  price: number;
  amount: number;
  onPriceChange: (coinName: string) => void;
}

export interface IInputFieldProps {
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  disabled?: boolean;
  numberMode?: string;
  maxValue?: number;
}

export interface IPerformanceChartProps {
  values: HistoricalTick[];
  onSelectCoin: (coinName: string) => void;
  activeCoin: string;
}

export interface IDonutChartProps {
  percentage: number;
  radius: number;
  strokeWidth: number;
  animationDelay: number;
  textSize: number;
}

export interface ISidebarItemProps {
  title: string;
  isExpanded: boolean;
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ISidebarUserProps extends ISidebarItemProps{
  fullName: string;
  email: string;
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ITopbarProps {
  activeTitle: string;
}

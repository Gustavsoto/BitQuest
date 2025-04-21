export interface UserTrade {
  cryptoName: string;
  amount: number;
  action: string;
  price: number;
}

export interface ITradesConsoleProps {
    trades: UserTrade[];
    isLoading: boolean;
}
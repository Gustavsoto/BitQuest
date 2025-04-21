import { PortfolioCoinAmount, StockCandle } from "../../interfaces/interfaces.props";

export interface ITradeBoxProps {
  changeActiveCoin: (coinName: string) => void
  firstCandle: StockCandle | undefined;
  portfolio: PortfolioCoinAmount[];
}
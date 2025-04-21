import { ScaleLinear } from "d3-scale";
import { StockCandle } from "../../interfaces/interfaces.props";

export interface Stick {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface IPriceProps {
  candle: StockCandle | undefined;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}

export interface ICandleStickChartProps {
  activeCoin: string;
}

export interface IChartProps {
  candles: StockCandle[] | undefined;
  domain: [number, number] | undefined;
  onCandleChange: ((newPrice: StockCandle) => void) | undefined;
}

export interface ICandleProps {
  candle: StockCandle;
  index: number;
  width: number;
  chartLength: number;
  scaleY: ScaleLinear<number, number>;
  scaleBody: ScaleLinear<number, number>;
}
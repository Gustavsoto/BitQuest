import { ICandleProps } from "./CandlestickChart.props";

export const Candle = (props: ICandleProps) => {
  const { candle, index, width, scaleY, scaleBody } = props;
  // fill krāsa
  const fill = candle.close > candle.open ? "#4AFA9A" : "#E33F64";

  // sākuma koordināte
  const x = scaleBody(index);
  // Pašas svecītes garums
  const max = Math.max(candle.open, candle.close);
  const min = Math.min(candle.open, candle.close);

  return (
    <>
      <line
        x1={x}
        y1={scaleY(candle.low)}
        x2={x}
        y2={scaleY(candle.high)}
        stroke={fill}
        strokeWidth={1}
      />

      <rect
        x={x - width / 2}
        y={scaleY(max)}
        width={width}
        height={Math.max(1, scaleY(min) - scaleY(max))}
        fill={fill}
      />
    </>
  );
};

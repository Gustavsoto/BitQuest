import { useEffect, useRef, useState } from "react";
import { Candle } from "./Candle";
import { IChartProps } from "./CandlestickChart.props";
import { scaleLinear } from "d3-scale";
import { useMouse } from "../../hooks/useMouse";

export const Chart = (props: IChartProps) => {
  // Priekš dinamiska resizing konteinerim
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Priekš līnijas kas tiek uzzīmēta
  const [mouseXPosition, mouseYPosition] = useMouse(containerRef);
  // Paddings priekšā un aizmugurē svg konteinerim
  const padding = 40;
  const { candles = [], domain, onCandleChange } = props;
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Y axis izmērs
  const scaleY = scaleLinear()
    .domain(domain ?? [0, 0])
    .range([size.height - padding, padding]);

  // X axis izmērs
  const scaleBody = scaleLinear()
    .domain([0, candles.length - 1])
    .range([padding, size.width - padding]);

  // selectotais candle index un cena
  const snappedIndex =
    mouseXPosition !== null ? Math.round(scaleBody.invert(mouseXPosition)) : 0;
  const [snappedPrice, setSnappedPrice] = useState<number>(
    candles[snappedIndex]?.close || 0
  );

  useEffect(() => {
    const newCandle = candles[snappedIndex] || null;
    if (newCandle) {
      setSnappedPrice(newCandle.close); // Šeit notiek updatota candle cena
    }
    if (onCandleChange && newCandle) {
      onCandleChange(newCandle);
    }
  }, [candles, snappedIndex, onCandleChange]);

  // Dinamisks resizings
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Šo vajag priekš līnijas un teksta
  const snappedXPosition =
    candles.length > 0
      ? scaleBody(snappedIndex) +
        Math.max(size.width / candles.length - 2 * padding - 10, 1) / 2
      : undefined;
  return (
    <div ref={containerRef} className="w-full h-full">
      {size.height > 0 && size.width > 0 && candles.length > 0 && (
        <svg className="bg-white dark:bg-black w-full h-full rounded-bl-xl rounded-br-xl">
          {candles.map((candle, idx) => {
            return (
              <Candle
                key={idx}
                candle={candle}
                index={idx}
                scaleY={scaleY}
                scaleBody={scaleBody}
                chartLength={candles.length}
                width={Math.max(size.width / candles.length - 5, 1)}
              />
            );
          })}

          {candles.length > 0 &&
            snappedXPosition &&
            mouseXPosition !== null &&
            mouseXPosition > 0 &&
            mouseXPosition < size.width &&
            mouseYPosition !== null &&
            mouseYPosition > padding &&
            mouseYPosition < size.height && (
              <>
                {/* Horizontālā līnija */}
                <line
                  x1={0}
                  y1={mouseYPosition}
                  x2={size.width}
                  y2={mouseYPosition}
                  className="stroke-black dark:stroke-white"
                  strokeDasharray="5,5"
                />

                {/* Vertikālā līnija */}
                <line
                  x1={snappedXPosition}
                  y1={0}
                  x2={snappedXPosition}
                  y2={size.height}
                  className="stroke-black dark:stroke-white"
                  strokeDasharray="5,5"
                />

                {/* Close cena */}
                <text
                  x={
                    snappedIndex > candles.length / 2
                      ? snappedXPosition - 60
                      : snappedXPosition + 10
                  }
                  y={mouseYPosition ? mouseYPosition - 20 : 0}
                  className="text-black dark:text-white stroke-black dark:stroke-white"
                  fontSize="12"
                  textAnchor="start"
                  alignmentBaseline="middle"
                >
                  {snappedPrice > 1
                    ? snappedPrice.toFixed(2)
                    : snappedPrice.toFixed(6)}
                </text>
              </>
            )}
        </svg>
      )}
    </div>
  );
};

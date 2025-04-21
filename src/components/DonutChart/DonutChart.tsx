import { useEffect, useRef, useState } from "react";
import { IDonutChartProps } from "../../interfaces/interfaces.props";

/**
 *
 * Sākotnēji gribēju foršu donutchart progresam bet nesanāca līdz galam izdomāt kur viņu ievietot. Nesanāca gana laiks
 */

export const DonuteChart = (props: IDonutChartProps) => {
  const { percentage, radius, strokeWidth, animationDelay, textSize } = props;
  const circleCircumference = 2 * Math.PI * radius;
  const circleRef = useRef<SVGCircleElement | null>(null);
  const [offset, setOffset] = useState<number>(circleCircumference);

  useEffect(() => {
    const strokeDashoffset =
      circleCircumference - (circleCircumference * percentage) / 100;
    const timeout = setTimeout(() => {
      setOffset(strokeDashoffset);
    }, animationDelay ?? 0);
    return () => clearTimeout(timeout);
  }, [circleCircumference, percentage, animationDelay]);

  return (
    <svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
      <g>
        <circle
          cy="50%"
          cx="50%"
          stroke="red"
          strokeWidth={strokeWidth}
          r={radius}
          fill="transparent"
          className="transform -rotate-45 origin-center fill-transparent stroke-green-500 dark:stroke-green-400 opacity-20"
        />
        <circle
          ref={circleRef}
          cy="50%"
          cx="50%"
          strokeWidth={strokeWidth}
          r={radius}
          strokeOpacity={1}
          strokeDasharray={circleCircumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transform -rotate-45 origin-center fill-transparent stroke-green-500 transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </g>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize={textSize}
        className="font-semibold fill-green-500"
      >
        {Math.floor(percentage)}%
      </text>
    </svg>
  );
};

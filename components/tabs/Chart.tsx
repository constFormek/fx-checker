import { calculateX, calculateY, formatChartDate } from "@/lib/helpers";
import { Fragment } from "react/jsx-runtime";

interface ChartProps {
  data: {
    date: string;
    rate: number;
  }[];
  k?: number;
}

const labelIndex = (i: number, k: number, lastIndex: number) => {
  const index = Math.round((i / (k - 1)) * lastIndex);
  return index;
};

const Chart = ({ data, k = 3 }: ChartProps) => {
  const labelGap = 16; // px
  const fontSize = 10; // tailwind utility text-preset-6
  const strokeWidth = 2;
  const textWidth = 36; // from design
  const plotWidth = 600;
  const plotHeight = 300;
  const chartWidth = plotWidth + labelGap + textWidth;
  const chartHeight = plotHeight + labelGap + fontSize;

  const pointsCount = data.length - 1;

  const minRate = Math.min(...data.map((d) => d.rate));
  const maxRate = Math.max(...data.map((d) => d.rate));

  const chartData = data.map((entry, index) => {
    const x = calculateX(index, pointsCount, plotWidth);
    const y = calculateY(
      entry.rate,
      minRate,
      maxRate,
      plotHeight - strokeWidth,
    );

    return {
      x: x,
      y: y,
    };
  });

  const indexes = Array.from({ length: k }, (_, i) =>
    labelIndex(i, k, pointsCount),
  );

  const dateLabelsIndexes = [...new Set(indexes)]

  const rateLabels = [minRate, (minRate + maxRate) / 2, maxRate];

  const pathString = chartData
    .map((entry, index) => {
      if (index === 0) return `M ${entry.x} ${entry.y}`;

      return `L ${entry.x} ${entry.y}`;
    })
    .join(" ");

  const areaString = `${pathString} L ${plotWidth} ${plotHeight} L 0 ${plotHeight} Z`;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
      <g transform={`translate(${labelGap + textWidth}, 0 )`}>
        <path d={areaString} fill="url(#chartFill)" stroke="none"></path>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9e937" stopOpacity="1" />
            <stop offset="100%" stopColor="#171719" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={pathString}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-lime-500"
        ></path>

        {dateLabelsIndexes.map((entry, index) => {
          const x = calculateX(entry, pointsCount, plotWidth);
          const textAnchor =
            index === 0
              ? "start"
              : index === dateLabelsIndexes.length - 1
                ? "end"
                : "middle";
          return (
            <text
              fontSize={fontSize}
              key={entry}
              x={x}
              y={chartHeight - 4}
              className="fill-neutral-200"
              textAnchor={textAnchor}
            >
              {formatChartDate(data[entry].date)}
            </text>
          );
        })}
      </g>

      {rateLabels.map((entry, index) => {
        const y = calculateY(entry, minRate, maxRate, plotHeight);
        const dominantBaseline =
          index === 0
            ? "text-after-edge"
            : index === rateLabels.length - 1
              ? "hanging"
              : "middle";
        return (
          <Fragment key={index}>
            <text
              fontSize={fontSize}
              x={textWidth}
              y={y}
              dominantBaseline={dominantBaseline}
              textAnchor="end"
              className="fill-neutral-200"
            >
              {entry.toFixed(4)}
            </text>

            <line
              x1={textWidth + labelGap}
              x2={plotWidth + textWidth + labelGap}
              y1={y}
              y2={y}
              strokeDasharray="2.5 6"
              className="stroke-neutral-500"
            ></line>
          </Fragment>
        );
      })}
    </svg>
  );
};

export default Chart;

"use client";

import { Fragment } from "react/jsx-runtime";
import {
  calculateX,
  calculateY,
  formatChartDate,
  getChartDimensions,
  getLabelIndex,
  getRateBounds,
} from "./helpers";
import { buildAreaString, buildPathString, mapToChartCoords } from "./helpers";
import {
  FONT_SIZE,
  LABEL_GAP,
  STROKE_WIDTH,
  TEXT_WIDTH,
} from "@/lib/constants";

interface ChartSvgProps {
  chartWidth: number;
  ratio: number;
  data: {
    date: string;
    rate: number;
  }[];
  k?: number;
}

const ChartSvg = ({ chartWidth, ratio, data, k = 3 }: ChartSvgProps) => {
  const chartDimensions = getChartDimensions(chartWidth, ratio);
  const pointsCount = data.length - 1;

  const plotDimensions = {
    width: chartDimensions.plotWidth,
    height: chartDimensions.plotHeight,
  };
  const chartCoords = mapToChartCoords(data, plotDimensions);

  const pathString = buildPathString(chartCoords);
  const areaString = buildAreaString(pathString, plotDimensions);

  const rateBounds = getRateBounds(data);

  const indexes = Array.from({ length: k }, (_, i) =>
    getLabelIndex(i, k, pointsCount),
  );

  const dateLabels = [...new Set(indexes)];

  const rateLabels =
    rateBounds.min === rateBounds.max
      ? [rateBounds.min]
      : [rateBounds.min, (rateBounds.min + rateBounds.max) / 2, rateBounds.max];

  console.log(rateBounds, rateLabels, data);
  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartDimensions.chartHeight}`}
      className="h-auto w-full"
    >
      <g transform={`translate(${LABEL_GAP + TEXT_WIDTH}, 0 )`}>
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
          strokeWidth={STROKE_WIDTH}
          className="stroke-lime-500"
        ></path>

        {dateLabels.map((entry, index) => {
          const x = calculateX(entry, pointsCount, chartDimensions.plotWidth);
          const textAnchor =
            index === 0
              ? "start"
              : index === dateLabels.length - 1
                ? "end"
                : "middle";
          return (
            <text
              fontSize={FONT_SIZE}
              key={entry}
              x={x}
              y={chartDimensions.chartHeight - 4}
              className="fill-neutral-200"
              textAnchor={textAnchor}
            >
              {formatChartDate(data[entry].date)}
            </text>
          );
        })}
      </g>

      {rateLabels.map((entry, index) => {
        const y = calculateY(
          entry,
          rateBounds.min,
          rateBounds.max,
          chartDimensions.plotHeight,
        );
        const dominantBaseline =
          index === 0
            ? "text-after-edge"
            : index === rateLabels.length - 1
              ? "hanging"
              : "middle";
        return (
          <Fragment key={index}>
            <text
              fontSize={FONT_SIZE}
              x={TEXT_WIDTH}
              y={y}
              dominantBaseline={dominantBaseline}
              textAnchor="end"
              className="fill-neutral-200"
            >
              {entry.toFixed(4)}
            </text>

            <line
              x1={TEXT_WIDTH + LABEL_GAP}
              x2={chartDimensions.plotWidth + TEXT_WIDTH + LABEL_GAP}
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

export default ChartSvg;

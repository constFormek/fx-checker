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
import { useState } from "react";
import { Pair } from "@/lib/currenciesStore";

interface ChartSvgProps {
  chartWidth: number;
  ratio: number;
  data: {
    date: string;
    rate: number;
  }[];
  pair: Pair;
  k?: number;
}

const ChartSvg = ({ chartWidth, ratio, data, pair, k = 3 }: ChartSvgProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartDimensions = getChartDimensions(chartWidth, ratio);
  const lastIndex = data.length - 1;

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const step = chartDimensions.plotWidth / lastIndex;
    let i = Math.round(x / step);
    i = Math.max(0, Math.min(lastIndex, i));
    if (i === activeIndex) return;

    setActiveIndex(i);
  };

  const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      const next = (activeIndex ?? 0) + delta;
      setActiveIndex(Math.max(0, Math.min(lastIndex, next)));
    }

    if (e.key === "Escape") setActiveIndex(null);
  };

  const plotDimensions = {
    width: chartDimensions.plotWidth,
    height: chartDimensions.plotHeight,
  };
  const chartCoords = mapToChartCoords(data, plotDimensions);

  const pathString = buildPathString(chartCoords);
  const areaString = buildAreaString(pathString, plotDimensions);

  const rateBounds = getRateBounds(data);

  const indexes = Array.from({ length: k }, (_, i) =>
    getLabelIndex(i, k, lastIndex),
  );

  const dateLabels = [...new Set(indexes)];

  const rateLabels =
    rateBounds.min === rateBounds.max
      ? [rateBounds.min]
      : [rateBounds.min, (rateBounds.min + rateBounds.max) / 2, rateBounds.max];

  return (
    <>
      <svg
        onBlur={() => setActiveIndex(null)}
        onKeyDown={(e) => {
          handleKeyDown(e);
        }}
        aria-label={`rate ${pair.base}/${pair.quote}, ${formatChartDate(data[0].date)} - ${formatChartDate(data[lastIndex].date)}, from ${rateBounds.min.toFixed(4)} to ${rateBounds.max.toFixed(4)}`}
        tabIndex={0}
        viewBox={`0 0 ${chartWidth} ${chartDimensions.chartHeight}`}
        className="focus-visible:rounded-8 h-auto w-full focus-visible:outline-2 focus-visible:outline-lime-500"
      >
        <g transform={`translate(${LABEL_GAP + TEXT_WIDTH}, 0 )`}>
          <path d={areaString} fill="url(#chartFill)" stroke="none"></path>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b9e937" stopOpacity="1" />
              <stop offset="100%" stopColor="#171719" stopOpacity="0" />
            </linearGradient>
          </defs>

          {activeIndex !== null && (
            <>
              <line
                className="stroke-neutral-500"
                x1={chartCoords[activeIndex].x}
                x2={chartCoords[activeIndex].x}
                y1={0}
                y2={chartDimensions.plotHeight}
              />

              <circle
                r={4.5}
                cx={chartCoords[activeIndex].x}
                cy={chartCoords[activeIndex].y}
                className="fill-neutral-50 stroke-neutral-50"
                strokeWidth={STROKE_WIDTH}
              />
            </>
          )}

          <path
            d={pathString}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeWidth={STROKE_WIDTH}
            className="stroke-lime-500"
          ></path>

          <rect
            width={chartDimensions.plotWidth}
            height={chartDimensions.plotHeight}
            fill="transparent"
            onPointerMove={(e) => {
              handlePointerMove(e);
            }}
            onPointerLeave={() => setActiveIndex(null)}
          />

          {dateLabels.map((entry, index) => {
            const x = calculateX(entry, lastIndex, chartDimensions.plotWidth);
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

      <div className="sr-only" aria-live="polite">
        {activeIndex !== null &&
          `${formatChartDate(data[activeIndex].date)}: ${data[activeIndex].rate.toFixed(4)}`}
      </div>

      {activeIndex !== null && (
        <div
          style={{
            top: chartCoords[activeIndex].y - 20,
            left: chartCoords[activeIndex].x + LABEL_GAP + TEXT_WIDTH,
          }}
          className={`${activeIndex === 0 ? "translate-x-0" : activeIndex === lastIndex ? "-translate-x-full" : "-translate-x-1/2"} rounded-8 pointer-events-none absolute flex -translate-y-full flex-col items-center gap-2 border border-neutral-500 bg-neutral-800 px-3 py-1 text-nowrap`}
        >
          <p className="text-preset-6 text-neutral-200">
            {formatChartDate(data[activeIndex].date)}
          </p>
          <p className="text-preset-4">{data[activeIndex].rate.toFixed(4)}</p>
        </div>
      )}
    </>
  );
};

export default ChartSvg;

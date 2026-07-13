"use client";

import useChartView from "@/lib/hooks/useChartView";
import { useEffect, useRef, useState } from "react";

import ChartSvg from "./ChartSvg";
import { formatChartDate, getChartDimensions } from "./helpers";
import { Pair } from "@/lib/currenciesStore";
import ErrorMessage from "../ErrorMessage";

interface ChartProps {
  data: {
    date: string;
    rate: number;
  }[];
  pair: Pair;
}

const Chart = ({ data, pair }: ChartProps) => {
  const [chartWidth, setChartWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setChartWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const chartView = useChartView();
  const chartHeight = getChartDimensions(
    chartWidth,
    chartView.ratio,
  ).chartHeight;

  return (
    <div className="rounded-16 flex flex-col gap-5 border border-neutral-600 bg-neutral-700 px-3 py-4">
      {data.length > 0 && (
        <div className="flex w-full justify-between">
          <h2 className="text-preset-3-medium">
            {pair.base}/{pair.quote}
          </h2>

          <div className="text-preset-5 flex items-center text-neutral-200">
            <p className="before:mx-2 not-first:before:content-['·']">
              {data[0].rate.toFixed(4)}
            </p>
            <p className="before:mx-2 not-first:before:content-['·']">
              {formatChartDate(data[data.length - 1].date)} 16:00 CET
            </p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: chartWidth ? chartHeight : undefined }}
      >
        {chartWidth > 0 &&
          (data.length > 0 ? (
            <ChartSvg
              pair={pair}
              chartWidth={chartWidth}
              data={data}
              ratio={chartView.ratio}
            />
          ) : (
            <ErrorMessage
              label="No data for this range"
              text="FX rates aren't published on weekends or holidays. Try a longer range."
              className="flex h-full items-center justify-center"
            />
          ))}
      </div>
    </div>
  );
};

export default Chart;

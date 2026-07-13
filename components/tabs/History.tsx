"use client";

import { useState } from "react";
import Chart from "./Chart";
import { CHARTS_PERIODS } from "@/lib/constants";
import { useRatesHistory } from "@/lib/hooks/useRatesHistory";
import { useRates } from "@/lib/hooks/useRates";
import { calculateX, calculateY } from "@/lib/helpers";

export type PeriodType = (typeof CHARTS_PERIODS)[number];

const History = () => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>("1m");
  const openRate = 0.8516;
  const lastRate = 0.853;
  const change = "+0.0014";
  const changePercentage = "+0.16%";
  const HistoryCardsMap = [
    {
      label: "Open",
      data: openRate,
    },
    {
      label: "Last",
      data: lastRate,
    },
    {
      label: "Change",
      data: change,
    },
    {
      label: "% Change",
      data: changePercentage,
    },
  ];

  const { data, error, isPending } = useRatesHistory(activePeriod);

  if (isPending) return <span>ŁADOWANIE</span>;
  if (error || !data) return <span>BŁĄD</span>;

  const chartsWidth = 600;
  const chartsHeight = 300;
  const pointsCount = data.length - 1;

  const minRate = Math.min(...data.map((d) => d.rate));
  const maxRate = Math.max(...data.map((d) => d.rate));

  const chartData = data.map((entry, index) => {
    const x = calculateX(index, pointsCount, chartsWidth);
    const y = calculateY(entry.rate, minRate, maxRate, chartsHeight);

    return {
      x: x,
      y: y,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 grid-rows-2 gap-2.5">
          {HistoryCardsMap.map((card) => (
            <div
              key={card.label}
              className="rounded-16 flex flex-col gap-4 border border-neutral-600 bg-neutral-700 px-5 py-3"
            >
              <p className="text-preset-4 text-neutral-200 uppercase">
                {card.label}
              </p>

              <p className="text-preset-2 text-neutral-50">{card.data}</p>
            </div>
          ))}
        </div>

        <div className="rounded-8 flex items-center justify-between bg-neutral-700 p-0.5">
          {CHARTS_PERIODS.map((period) => (
            <button
              onClick={() => {
                setActivePeriod(period);
              }}
              key={period}
              className={`${activePeriod === period ? "bg-neutral-500 text-neutral-50" : "bg-transparent text-neutral-200"} rounded-8 px-4 py-3 uppercase transition`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-16 flex flex-col gap-5 border border-neutral-600 bg-neutral-700 px-3 py-4">
        <div className="flex w-full justify-between">
          <p className="text-preset-3-medium">{"USD/EUR"}</p>

          <div className="text-preset-5 flex items-center text-neutral-200">
            <p className="before:mx-2 not-first:before:content-['·']">
              {lastRate}
            </p>

            <p className="before:mx-2 not-first:before:content-['·']">
              {"MAY 14 16:00 CET"}
            </p>
          </div>
        </div>

        <Chart chartData={chartData} width={chartsWidth} height={chartsHeight}/>
      </div>
    </div>
  );
};

export default History;

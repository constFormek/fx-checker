"use client";

import { useState } from "react";
import Chart from "./Chart";
import { CHARTS_PERIODS } from "@/lib/constants";
import { useRatesHistory } from "@/lib/hooks/useRatesHistory";

import { calculateChange, formatChartDate } from "@/lib/helpers";
import ChangeIndicator, { getDirection, stylesMap } from "../ChangeIndicator";
import { useCurrencies } from "@/lib/currenciesStore";
import ErrorMessage from "./ErrorMessage";

export type PeriodType = (typeof CHARTS_PERIODS)[number];

const History = () => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>("1m");
  const { data, error, isPending } = useRatesHistory(activePeriod);
  const pair = useCurrencies((s) => s.pair);

  if (isPending) return <span>ŁADOWANIE</span>;
  if (error || !data)
    return (
      <ErrorMessage
        label="No chart data available"
        text={`We couldn't load rate history for ${pair.base}/${pair.quote} right now. This usually clears up in a minute.`}
      />
    );

  const openRate = data[0].rate;
  const lastRate = data[data.length - 1].rate;

  const changeObject = calculateChange(openRate, lastRate);
  const direction = getDirection(changeObject.change);

  const HistoryCardsMap = [
    {
      label: "Open",
      content: (
        <p className="text-preset-2 text-neutral-50">{openRate.toFixed(4)}</p>
      ),
    },
    {
      label: "Last",
      content: (
        <p className="text-preset-2 text-neutral-50">{lastRate.toFixed(4)}</p>
      ),
    },
    {
      label: "Change",
      content: (
        <span
          className={`${stylesMap[direction].color} text-preset-2 flex items-center`}
        >
          {stylesMap[direction].prefix}
          {changeObject.change.toFixed(4)}
        </span>
      ),
    },
    {
      label: "% Change",
      content: (
        <ChangeIndicator
          changePercentage={changeObject.percentage}
          className="text-preset-2"
        />
      ),
    },
  ];

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

              {card.content}
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
          <p className="text-preset-3-medium">
            {pair.base}/{pair.quote}
          </p>

          <div className="text-preset-5 flex items-center text-neutral-200">
            <p className="before:mx-2 not-first:before:content-['·']">
              {lastRate.toFixed(4)}
            </p>

            <p className="before:mx-2 not-first:before:content-['·']">
              {formatChartDate(data[data.length - 1].date)} 16:00 CET
            </p>
          </div>
        </div>

        <Chart data={data} />
      </div>
    </div>
  );
};

export default History;

"use client";

import { useState } from "react";
import Chart from "./Chart";
import { CHARTS_PERIODS } from "@/lib/constants";
import { useRatesHistory } from "@/lib/hooks/useRatesHistory";

import { useCurrencies } from "@/lib/currenciesStore";
import ErrorMessage from "../ErrorMessage";
import HistoryStats from "./HistoryStats";
import HistoryStatsEmpty from "./HistoryStatsEmpty";

export type PeriodType = (typeof CHARTS_PERIODS)[number];

const History = () => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>("1m");
  const { data, error, isPending } = useRatesHistory(activePeriod);

  const pair = useCurrencies((s) => s.pair);
  if (error)
    return (
      <ErrorMessage
        label="No chart data available"
        text={`We couldn't load rate history for ${pair.base}/${pair.quote} right now. This usually clears up in a minute.`}
      />
    );

  const rates = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 grid-rows-2 gap-2.5 md:grid-cols-4 md:grid-rows-1 md:items-center md:gap-4 lg:flex">
          {rates.length > 0 && !isPending ? (
            <HistoryStats data={rates} />
          ) : (
            <HistoryStatsEmpty isPending={isPending} />
          )}
        </div>

        <div className="rounded-8 flex items-center justify-between bg-neutral-700 p-0.5 md:w-fit">
          {CHARTS_PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => {
                setActivePeriod(period);
              }}
              className={`${activePeriod === period ? "bg-neutral-500 text-neutral-50" : "bg-transparent text-neutral-200"} rounded-8 peer cursor-pointer px-4 py-3 uppercase transition-colors hover:bg-neutral-400 hover:text-neutral-50 focus-visible:outline-1 focus-visible:outline-offset-[2.5px] focus-visible:outline-lime-500`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <Chart data={rates} pair={pair} isPending={isPending} />
    </div>
  );
};

export default History;

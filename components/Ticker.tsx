"use client";

import { TICKER_PAIRS } from "@/lib/constants";
import { favoriteEntryId, getPairSnapshot } from "@/lib/helpers";
import { useRates } from "@/lib/hooks/useRates";

import ChangeIndicator from "./ChangeIndicator";

const Ticker = () => {
  const { data, error, isPending } = useRates();

  if (error) return <span>BŁĄD</span>;
  if (!data || isPending) return <TickerSkeleton />;

  const tickerArray = TICKER_PAIRS.map((entry) => {
    return {
      ...getPairSnapshot(data, entry.base, entry.quote),
      pair: { base: entry.base, quote: entry.quote },
    };
  });

  return (
    <div
      aria-hidden
      className="text-preset-6 md:text-preset-5-medium flex items-center"
    >
      <div className="flex items-center gap-2 bg-lime-500 px-2 py-3 text-neutral-900 uppercase md:px-4 md:py-3">
        <div className="aspect-square w-1.5 rounded-full bg-neutral-900"></div>

        <p className="text-nowrap">Live markets</p>
      </div>

      <div className="ticker-wrapper scrollbar-custom w-full overflow-hidden">
        <div className="ticker-track flex w-max items-center">
          {tickerArray.map((tickerEntry) => (
            <TickerItem
              key={favoriteEntryId(
                tickerEntry.pair.base,
                tickerEntry.pair.quote,
              )}
              pair={tickerEntry.pair}
              changePercentage={tickerEntry.changePercentage}
              rate={tickerEntry.todaysRate}
            />
          ))}

          {tickerArray.map((tickerEntry) => (
            <TickerItem
              key={`copy-${favoriteEntryId(tickerEntry.pair.base, tickerEntry.pair.quote)}`}
              pair={tickerEntry.pair}
              changePercentage={tickerEntry.changePercentage}
              rate={tickerEntry.todaysRate}
              isCopy
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TickerSkeleton = () => {
  return (
    <div
      aria-hidden
      className="text-preset-6 md:text-preset-5-medium flex items-center"
    >
      <div className="flex items-center gap-2 bg-lime-500 px-2 py-3 text-neutral-900 uppercase md:px-4 md:py-3">
        <div className="aspect-square w-1.5 rounded-full bg-neutral-900"></div>

        <p className="text-nowrap">LOADING...</p>
      </div>

      <div className="ticker-wrapper scrollbar-custom w-full overflow-hidden">
        <div className="ticker-track flex w-max items-center">
          {TICKER_PAIRS.map((p) => (
            <div
              key={p.base + p.quote}
              className="flex items-center gap-2.5 border-r border-r-neutral-500 bg-neutral-700 p-3 md:px-4 md:py-3"
            >
              <p className="text-nowrap text-neutral-200 uppercase">
                {p.base}/{p.quote}
              </p>
              <div className="h-4 w-16 animate-pulse rounded bg-neutral-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface TickerItemProps {
  rate: number;
  pair: { base: string; quote: string };
  changePercentage: number;
  isCopy?: boolean;
}

export const TickerItem = ({
  rate,
  pair,
  changePercentage,
  isCopy,
}: TickerItemProps) => {
  return (
    <div
      aria-hidden={isCopy}
      className={`${isCopy ? "ticker-track-copy" : ""} flex items-center gap-2.5 border-r border-r-neutral-500 bg-neutral-700 p-3 uppercase md:px-4 md:py-3`}
    >
      <p className="text-nowrap text-neutral-200">
        {pair.base}/{pair.quote}
      </p>

      <div className="flex items-center gap-1.5">
        <p className="text-preset-5-medium">{rate.toFixed(2)}</p>

        <ChangeIndicator changePercentage={changePercentage} />
      </div>
    </div>
  );
};

export default Ticker;

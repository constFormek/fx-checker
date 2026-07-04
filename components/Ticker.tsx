"use client";

import { TICKER_PAIRS } from "@/lib/constants";
import { favoriteEntryId, getPairSnapshot } from "@/lib/helpers";
import { useCurrencies } from "@/lib/hooks/useCurrencies";
import Icon from "./Icon";

const Ticker = () => {
  const { data, error, isPending } = useCurrencies();

  if (isPending) return <span>ŁADOWANIE</span>;
  if (error) return <span>BŁĄD</span>;

  const datesArray = Object.keys(data);
  const tickerArray = TICKER_PAIRS.map((entry) => {
    return {
      ...getPairSnapshot(data, datesArray, entry.base, entry.quote),
      pair: { base: entry.base, quote: entry.quote },
    };
  });
  return (
    <div className="text-preset-6 md:text-preset-5-medium flex items-center">
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

interface TickerItemProps {
  rate: number;
  pair: { base: string; quote: string };
  changePercentage: number;
  isCopy?: boolean;
}

const stylesMap = {
  up: {
    color: "text-green-500",
    prefix: "+",
    Icon: <Icon name="chevron-down" size={12} className="rotate-180" />,
  },
  down: {
    color: "text-red-500",
    prefix: "",
    Icon: <Icon name="chevron-down" size={12} className="rotate-0" />,
  },
  flat: { color: "text-neutral-200", prefix: "", Icon: <></> },
};

export const TickerItem = ({
  rate,
  pair,
  changePercentage,
  isCopy,
}: TickerItemProps) => {
  const direction =
    changePercentage > 0 ? "up" : changePercentage < 0 ? "down" : "flat";

  return (
    <div
      aria-hidden={isCopy}
      className={`${isCopy ? "ticker-track-copy" : ""} flex items-center gap-2.5 border-r border-r-neutral-500 bg-neutral-700 p-3 uppercase md:px-4 md:py-3`}
    >
      <p className="text-nowrap text-neutral-200">
        {pair.base}/{pair.quote}
      </p>

      <p className="text-neutral-50">{rate.toFixed(2)}</p>

      <div className={`${stylesMap[direction].color} flex items-center gap-1`}>
        {stylesMap[direction].Icon}

        <span>
          {stylesMap[direction].prefix}
          {changePercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default Ticker;

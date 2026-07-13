"use client";

import Icon from "../Icon";

import ChangeIndicator from "../ChangeIndicator";
import FavoriteButton from "./FavoriteButton";
import { useCurrencies } from "@/lib/currenciesStore";

interface FavoriteItemProps {
  pair: { base: string; quote: string };
  rate: number;
  changePercentage: number;
}

const FavoriteItem = ({ pair, changePercentage, rate }: FavoriteItemProps) => {
  const setPair = useCurrencies((s) => s.setPair);

  const handleClick = () => {
    setPair(pair.base, pair.quote);
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior: behavior });
  };
  return (
    <li className="rounded-10 flex w-full items-center justify-between border border-neutral-500 bg-neutral-600 pr-4 transition-colors hover:border-neutral-300 has-[button:first-child:focus-visible]:outline-1 has-[button:first-child:focus-visible]:outline-offset-[2.5px] has-[button:first-child:focus-visible]:outline-lime-500">
      <button
        onClick={handleClick}
        aria-label={`Load ${pair.base}/${pair.quote} to converter`}
        className="rounded-10 flex grow cursor-pointer items-center justify-between gap-2.5 px-4 py-3 text-left focus-visible:outline-none"
      >
        <div className="text-preset-4 flex items-center gap-2">
          {pair.base}

          <Icon name="arrow-right" size={10} />

          {pair.quote}
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <p className="text-preset-3">{rate.toFixed(4)}</p>

          <ChangeIndicator changePercentage={changePercentage} />
        </div>
      </button>

      <FavoriteButton pair={pair} />
    </li>
  );
};

export default FavoriteItem;

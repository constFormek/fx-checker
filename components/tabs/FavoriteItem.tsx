"use client";

import Icon from "../Icon";

import ChangeIndicator from "../ChangeIndicator";
import FavoriteButton from "./FavoriteButton";

interface FavoriteItemProps {
  pair: { base: string; quote: string };
  rate: number;
  changePercentage: number;
}

const FavoriteItem = ({ pair, changePercentage, rate }: FavoriteItemProps) => {
  return (
    <div className="rounded-10 flex w-full items-center justify-between border border-neutral-500 bg-neutral-600 px-4 py-3">
      <div className="text-preset-4 flex items-center gap-2">
        {pair.base}

        <Icon name="arrow-right" size={10} />

        {pair.quote}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-1.5">
          <p className="text-preset-3">{rate.toFixed(2)}</p>

          <ChangeIndicator changePercentage={changePercentage} />
        </div>

        <FavoriteButton pair={pair} />
      </div>
    </div>
  );
};

export default FavoriteItem;

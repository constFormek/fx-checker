"use client";

import { useCurrencies } from "@/lib/currenciesStore";
import Icon from "../Icon";
import { favoriteEntryId } from "@/lib/helpers";
import { useShallow } from "zustand/shallow";
import { FAVORITES_LIMIT } from "@/lib/constants";

interface FavoriteButtonProps {
  pair: { base: string; quote: string };
}
const FavoriteButton = ({ pair }: FavoriteButtonProps) => {
  const id = favoriteEntryId(pair.base, pair.quote);
  const { toggleFavorite, isFavorite } = useCurrencies(
    useShallow((s) => ({
      toggleFavorite: s.toggleFavorite,
      isFavorite: s.favorites.some((f) => f.id === id),
    })),
  );

  return (
    <button
      aria-label={
        isFavorite
          ? `remove ${pair.base}/${pair.quote} from favorites`
          : `add ${pair.base}/${pair.quote} to favorites`
      }
      aria-pressed={isFavorite}
      onClick={() => {
        toggleFavorite({
          base: pair.base,
          quote: pair.quote,
        });
      }}
      className={`${isFavorite ? "border-lime-500 text-lime-500" : "border-neutral-500 text-neutral-50"} rounded-8 cursor-pointer border p-2 hover:bg-neutral-400 focus-visible:border-neutral-500 focus-visible:outline-1 focus-visible:outline-offset-[2.5px] focus-visible:outline-lime-500`}
    >
      {isFavorite ? (
        <Icon name="star-filled" size={16} />
      ) : (
        <Icon name="star" size={16} />
      )}
    </button>
  );
};

export default FavoriteButton;

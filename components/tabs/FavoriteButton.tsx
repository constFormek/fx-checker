"use client";

import { useCurrencies } from "@/lib/currenciesStore";
import Icon from "../Icon";
import { favoriteEntryId } from "@/lib/helpers";

interface FavoriteButtonProps {
  pair: { base: string; quote: string };
}
const FavoriteButton = ({ pair }: FavoriteButtonProps) => {
  const id = favoriteEntryId(pair.base, pair.quote);
  const toggleFavorite = useCurrencies((s) => s.toggleFavorite);
  const isFavorite = useCurrencies((s) =>
    s.favoritesList.some((f) => f.id === id),
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
      className={`${isFavorite ? "border-lime-500 text-lime-500" : "border-neutral-500 text-neutral-50"} rounded-8 border p-2`}
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

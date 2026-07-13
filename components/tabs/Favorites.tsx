import { useCurrencies } from "@/lib/currenciesStore";

import { useRates } from "@/lib/hooks/useRates";
import { getPairSnapshot } from "@/lib/helpers";
import FavoriteItem from "./FavoriteItem";
import ErrorMessage from "./ErrorMessage";

const Favorites = () => {
  const favorites = useCurrencies((s) => s.favorites);

  const { data, error, isPending } = useRates();

  if (isPending) return <span>ŁADOWANIE</span>;
  if (error) return <span>BŁĄD</span>;

  const favoritesEntries = favorites.map((entry) => {
    return {
      id: entry.id,
      ...getPairSnapshot(data, entry.pair.base, entry.pair.quote),
      pair: { base: entry.pair.base, quote: entry.pair.quote },
    };
  });

  if (favorites.length === 0)
    return (
      <ErrorMessage
        label="No pinned pairs yet"
        text="Pin a pair to track its rate here. Tap the star icon on any conversion or comparision row."
      />
    );

  return (
    <div className="rounded-16 flex w-full flex-col gap-4 border border-neutral-600 bg-neutral-700 p-4">
      <div className="flex w-full items-center justify-between uppercase">
        <h2 className="text-preset-3-medium">Pinned pairs</h2>

        <p className="text-preset-5 text-neutral-200">
          {favorites.length} Favorite{favorites.length > 1 && "s"}
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {favoritesEntries.map((entry) => (
          <FavoriteItem
            key={entry.id}
            rate={entry.todaysRate}
            pair={entry.pair}
            changePercentage={entry.changePercentage}
          />
        ))}
      </ul>
    </div>
  );
};

export default Favorites;

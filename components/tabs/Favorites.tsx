import { useCurrencies } from "@/lib/currenciesStore";

import { useRates } from "@/lib/hooks/useRates";
import { getPairSnapshot } from "@/lib/helpers";
import FavoriteItem from "./FavoriteItem";

const Favorites = () => {
  const favoritesList = useCurrencies((s) => s.favoritesList);

  const { data, error, isPending } = useRates();

  if (isPending) return <span>ŁADOWANIE</span>;
  if (error) return <span>BŁĄD</span>;

  const favoritesArray = favoritesList.map((entry) => {
    return {
      id: entry.id,
      ...getPairSnapshot(data, entry.pair.base, entry.pair.quote),
      pair: { base: entry.pair.base, quote: entry.pair.quote },
    };
  });

  if (favoritesList.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <h3 className="text-preset-2 text-neutral-100">No pinned pairs yet</h3>

        <p className="text-preset-4 max-w-115 text-neutral-200">
          Pin a pair to track its rate here. Tap the star icon on any conversion
          or comparision row.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-16 flex w-full flex-col gap-4 border border-neutral-600 bg-neutral-700 p-4">
      <div className="flex w-full items-center justify-between uppercase">
        <p className="text-preset-3-medium">Pinned pairs</p>

        <p className="text-preset-5">{favoritesList.length} Favorites</p>
      </div>

      <div className="flex flex-col gap-3">
        {favoritesArray.map((entry) => (
          <FavoriteItem
            key={entry.id}
            rate={entry.todaysRate}
            pair={entry.pair}
            changePercentage={entry.changePercentage}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;

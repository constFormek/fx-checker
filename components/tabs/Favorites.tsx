import { useCurrencies } from "@/lib/currenciesStore";
import Icon from "../Icon";

const Favorites = () => {
  const favoritesList = useCurrencies((s) => s.favoritesList);
  const toggleFavorite = useCurrencies((s) => s.toggleFavorite);

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
        {favoritesList.map((entry) => (
          <div
            key={entry.id}
            className="rounded-10 flex w-full items-center justify-between border border-neutral-500 bg-neutral-600 px-4 py-3"
          >
            <div className="text-preset-4 flex items-center gap-2">
              {entry.pair.base}

              <Icon name="arrow-right" size={10} />

              {entry.pair.quote}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1.5">
                <p className="text-preset-3">0.8530</p>

                <div className="text-preset-6 flex items-center justify-end text-green-500">
                  <Icon name="chevron-down" size={10} />

                  <p>+0.16%</p>
                </div>
              </div>

              <button
                onClick={() => {
                  toggleFavorite({
                    base: entry.pair.base,
                    quote: entry.pair.quote,
                  });
                }}
                className="rounded-8 border border-lime-500 p-2 text-lime-500"
              >
                <Icon name="star-filled" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;

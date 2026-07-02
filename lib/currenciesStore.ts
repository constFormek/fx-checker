import { create } from "zustand";
import { CurrencyEntry } from "./currencyApi";
import { INITIAL_PAIR } from "./constants";
import { persist } from "zustand/middleware";
import { favoriteEntryId } from "./helpers";

type CurrenciesStoreState = {
  list: CurrencyEntry[];
  map: Record<string, CurrencyEntry>;
  pair: {
    base: string;
    quote: string;
  };
  amount: string;
  favoritesList: { id: string; pair: { base: string; quote: string } }[];
};

type CurrenciesStoreActions = {
  setAmount: (newAmount: string) => void;
  setPair: (send: string, receive: string) => void;
  toggleFavorite: (pair: { base: string; quote: string }) => void;
  hydrateCurrencies: (array: CurrencyEntry[]) => void;
};

type CurrenciesStore = CurrenciesStoreState & CurrenciesStoreActions;

export const useCurrencies = create<CurrenciesStore>()(
  persist(
    (set, get) => ({
      list: [],
      map: {},
      amount: "1",
      pair: {
        base: INITIAL_PAIR.base,
        quote: INITIAL_PAIR.quote,
      },

      favoritesList: [],

      setAmount: (newAmount) => {
        set({ amount: newAmount });
      },

      hydrateCurrencies: (array) => {
        const object = Object.fromEntries(
          array.map((entry) => [entry.iso_code, entry]),
        );
        set({ list: array, map: object });
      },

      toggleFavorite: (pair) => {
        const id = favoriteEntryId(pair.base, pair.quote);
        const favoritesList = get().favoritesList;
        const entry = favoritesList.find((e) => e.id === id);

        const newFavorites = entry
          ? favoritesList.filter((e) => e.id !== id)
          : [{ id: id, pair: pair }, ...favoritesList];

        set({
          favoritesList: newFavorites,
        });
      },

      setPair: (base, quote) => {
        set({
          pair: {
            base: base,
            quote: quote,
          },
        });
      },
    }),
    {
      name: "state",
      partialize: (state) => ({
        pair: state.pair,
        favoritesList: state.favoritesList,
      }),
      skipHydration: true,
    },
  ),
);

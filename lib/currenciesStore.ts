import { create } from "zustand";
import { CurrencyEntry } from "./currencyApi";
import { INITIAL_PAIR } from "./constants";
import { persist } from "zustand/middleware";

type CurrenciesStoreState = {
  list: CurrencyEntry[];
  map: Record<string, CurrencyEntry>;
  pair: {
    base: string;
    quote: string;
  };
  amount: string;
};

type CurrenciesStoreActions = {
  setAmount: (newAmount: string) => void;
  setPair: (send: string, receive: string) => void;
  hydrateCurrencies: (array: CurrencyEntry[]) => void;
};

type CurrenciesStore = CurrenciesStoreState & CurrenciesStoreActions;

export const useCurrencies = create<CurrenciesStore>()(
  persist(
    (set) => ({
      list: [],
      map: {},
      amount: "1",
      pair: {
        base: INITIAL_PAIR.base,
        quote: INITIAL_PAIR.quote,
      },

      setAmount: (newAmount) => {
        set({ amount: newAmount });
      },

      hydrateCurrencies: (array) => {
        const object = Object.fromEntries(
          array.map((entry) => [entry.iso_code, entry]),
        );
        set({ list: array, map: object });
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
      name: "lastPair",
      partialize: (state) => ({ pair: state.pair }),
      skipHydration: true,
    },
  ),
);

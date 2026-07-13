"use client";

import CurrencyInput from "./CurrencyInput";
import Icon from "../Icon";

import { useConverter } from "@/lib/hooks/useConverter";
import { useCurrencies } from "@/lib/currenciesStore";
import { favoriteEntryId } from "@/lib/helpers";
import { useShallow } from "zustand/shallow";
import { FAVORITES_LIMIT } from "@/lib/constants";

interface ConverterProps {
  initialRate: number;
}

const Converter = ({ initialRate }: ConverterProps) => {
  const {
    base,
    quote,
    quoteValue,
    baseValue,
    activeInput,
    exchangeRate,
    error,
    isLoading,
    changeCurrency,
    swapCurrencies,
    changeAmount,
  } = useConverter(initialRate);

  const { toggleFavorite, favorites, logConversion } = useCurrencies(
    useShallow((s) => ({
      toggleFavorite: s.toggleFavorite,
      favorites: s.favorites,
      logConversion: s.logConversion,
    })),
  );

  const favoritesCount = favorites.length;
  const isFavorited = favorites.some(
    (e) => e.id === favoriteEntryId(base, quote),
  );

  const isFavoritesDisabled = favoritesCount >= FAVORITES_LIMIT && !isFavorited;

  const favoritesAriaLabel = isFavoritesDisabled
    ? "Favorites limit reached. Remove a pair to add new ones"
    : isFavorited
      ? `remove ${base}/${quote} from favorites`
      : `add ${base}/${quote} to favorites`;

  const isLogConversionDisabled = baseValue === "" || quoteValue === "";

  const logConversionAriaLabel = isLogConversionDisabled
    ? "Please enter an amount first"
    : `Log ${baseValue} in ${base} to ${quoteValue} in ${quote}`;

  return (
    <main className="rounded-20 z-30 flex flex-col divide-y-2 divide-dashed divide-neutral-500 bg-neutral-700 drop-shadow-[0px_12px_40px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col items-center gap-4 p-4 md:flex-row md:gap-6 md:p-5">
        <CurrencyInput
          amount={baseValue}
          currentCode={base}
          variant="base"
          activeInput={activeInput}
          changeCurrency={changeCurrency}
          changeAmount={changeAmount}
        />

        <button
          aria-label="Swap currencies"
          onClick={swapCurrencies}
          className="rounded-8 w-fit cursor-pointer border border-neutral-500 bg-neutral-600 p-3.25 transition-colors hover:bg-neutral-400 focus-visible:outline-1 focus-visible:outline-offset-[2.5px] focus-visible:outline-lime-500"
        >
          <Icon
            name="exchange-vertical"
            size={20}
            className="text-neutral-50 md:rotate-90"
          />
        </button>

        <CurrencyInput
          amount={quoteValue}
          currentCode={quote}
          variant="quote"
          activeInput={activeInput}
          changeCurrency={changeCurrency}
          changeAmount={changeAmount}
        />
      </div>

      <div className="flex flex-col items-center gap-4 p-4 md:flex-row md:justify-between md:px-5 md:py-4">
        <p
          aria-live="polite"
          className="text-preset-6 md:text-preset-5 flex flex-col gap-2 text-center md:flex-row"
        >
          {error && (
            <>
              <span className="flex flex-col text-red-500 md:flex-row">
                Oops! Failed to load the rate. Last known rate:
              </span>
            </>
          )}
          1 {base.toUpperCase()} = {exchangeRate} {quote.toUpperCase()}
        </p>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              aria-label={favoritesAriaLabel}
              disabled={isFavoritesDisabled}
              onClick={() => toggleFavorite({ base: base, quote: quote })}
              className={` ${
                isFavorited
                  ? "border-lime-500 bg-lime-500 text-neutral-900 hover:border-lime-500/80 hover:bg-lime-500/80"
                  : `${
                      isFavoritesDisabled
                        ? "bg-transparent"
                        : "bg-neutral-600 hover:bg-neutral-500"
                    } border-neutral-300 text-neutral-200`
              } rounded-8 peer text-preset-5-medium flex w-fit cursor-pointer items-center gap-2 border px-3 py-2 uppercase transition-colors outline-none`}
            >
              {isFavorited ? (
                <>
                  <Icon name="star-filled" size={12} />
                  <span>Favorited</span>
                </>
              ) : (
                <>
                  <Icon name="star" size={12} />
                  <span>Favorite</span>
                </>
              )}
            </button>

            <span className="rounded-10 pointer-events-none absolute -inset-0.75 peer-focus-visible:outline-2 peer-focus-visible:outline-lime-500" />
          </div>

          <div className="relative">
            <button
              aria-label={logConversionAriaLabel}
              onClick={() => {
                logConversion(
                  { base: base, quote: quote },
                  Date.now(),
                  baseValue,
                  quoteValue,
                );
              }}
              disabled={isLogConversionDisabled}
              className={`${isLogConversionDisabled ? "border-neutral-300 text-neutral-200" : "border-lime-500 text-neutral-50 hover:bg-lime-800"} rounded-8 peer text-preset-5-medium flex w-fit cursor-pointer items-center gap-2 border px-3 py-2 text-nowrap uppercase transition-colors outline-none`}
            >
              Log conversion
            </button>

            <span className="rounded-10 pointer-events-none absolute -inset-0.75 peer-focus-visible:outline-2 peer-focus-visible:outline-lime-500" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Converter;

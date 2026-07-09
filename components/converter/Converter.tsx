"use client";

import CurrencyInput from "./CurrencyInput";
import Icon from "../Icon";

import { useConverter } from "@/lib/hooks/useConverter";
import { useCurrencies } from "@/lib/currenciesStore";
import { favoriteEntryId } from "@/lib/helpers";

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

  const toggleFavorite = useCurrencies((s) => s.toggleFavorite);
  const favorites = useCurrencies((s) => s.favorites);
  const logConversion = useCurrencies((s) => s.logConversion);
  const isFavorited = favorites.find(
    (e) => e.id === favoriteEntryId(base, quote),
  );
  const isConversionDisabled = baseValue === "" || quoteValue === "";
  return (
    <div className="rounded-20 relative z-30 flex w-full flex-col divide-y-2 divide-dashed divide-neutral-500 bg-neutral-700 drop-shadow-[0px_12px_40px_rgba(0,0,0,0.4)]">
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
          onClick={swapCurrencies}
          className="rounded-8 w-fit border border-neutral-500 bg-neutral-600 p-3.25"
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
          role="alert"
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
          <button
            onClick={() => toggleFavorite({ base: base, quote: quote })}
            className={`${isFavorited ? "border-lime-500 bg-lime-500 text-neutral-900" : "border-neutral-300 bg-neutral-600 text-neutral-200"} rounded-8 flex w-fit items-center gap-2 border px-3 py-2 uppercase`}
          >
            {isFavorited ? (
              <>
                <Icon name="star-filled" size={20} />
                <span>Favorited</span>
              </>
            ) : (
              <>
                <Icon name="star" size={20} />
                <span>Favorite{isFavorited && "d"}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              logConversion(
                { base: base, quote: quote },
                Date.now(),
                baseValue,
                quoteValue,
              );
            }}
            disabled={isConversionDisabled}
            className={`${isConversionDisabled ? "border-neutral-300 text-neutral-200" : "border-lime-500 text-neutral-50"} rounded-8 flex w-fit items-center gap-2 border px-3 py-2 text-nowrap uppercase transition`}
          >
            Log conversion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Converter;

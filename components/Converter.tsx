"use client";

import CurrencyInput from "./CurrencyInput";
import Icon from "./Icon";

import { useConverter } from "@/lib/hooks/useConverter";

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

  return (
    <div className="rounded-20 flex w-full flex-col divide-y-2 divide-dashed divide-neutral-500 bg-neutral-700">
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
        <p className="text-preset-6 md:text-preset-5 text-center">
          1 {base.toUpperCase()} = {exchangeRate} {quote.toUpperCase()}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="rounded-8 flex w-fit items-center gap-2 border border-neutral-300 bg-neutral-600 px-3 py-2 text-neutral-200 uppercase"
          >
            <Icon name="star" size={20} />
            <span>Favorite</span>
          </button>

          <button
            onClick={() => {}}
            className="rounded-8 flex w-fit items-center gap-2 border border-neutral-300 px-3 py-2 text-nowrap text-neutral-200 uppercase"
          >
            Log conversion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Converter;

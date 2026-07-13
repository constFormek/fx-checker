"use client";

import CurrencySelector from "./CurrencySelector";

export type inputVariant = "base" | "quote";

interface CurrencyInputProps {
  amount: string;
  currentCode: string;
  variant: inputVariant;
  activeInput: inputVariant;
  changeCurrency: (input: inputVariant, code: string) => void;
  changeAmount: (variant: inputVariant, newAmount: string) => void;
}
const CurrencyInput = ({
  amount,
  currentCode,
  variant,
  changeCurrency,
  changeAmount,
}: CurrencyInputProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    changeAmount(variant, e.target.value);
  };

  return (
    <div className="rounded-16 md:rounded-20 relative flex w-full flex-col justify-between gap-5 border border-neutral-500 bg-neutral-600 p-4 md:p-5">
      <label
        htmlFor={variant}
        className="text-preset-4 text-neutral-100 uppercase"
      >
        {variant === "base" ? "Send" : "Receive"}
      </label>

      <div className="flex w-full items-center justify-between">
        <input
          maxLength={10}
          id={variant}
          className={`${variant === "quote" ? "text-lime-500 placeholder:text-lime-500" : "text-neutral-50 placeholder:text-neutral-50"} ' text-preset-1 w-7/10 max-w-7/10 font-bold outline-none`}
          type="text"
          placeholder={"-"}
          onChange={(e) => handleChange(e)}
          value={amount}
        />

        <CurrencySelector
          variant={variant}
          changeCurrency={changeCurrency}
          currentCode={currentCode}
        />
      </div>
    </div>
  );
};

export default CurrencyInput;

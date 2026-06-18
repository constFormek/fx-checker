"use client";

export type inputVariant = "send" | "receive";

interface CurrencyInputProps {
  amount: string;
  currency: string;
  variant: inputVariant;
  handleNewAmount: (variant: inputVariant, newAmount: string) => void;
  activeInput: inputVariant;
}
const CurrencyInput = ({
  amount,
  currency,
  variant,
  handleNewAmount,
  activeInput,
}: CurrencyInputProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    if (e.target.value === "") {
      handleNewAmount(variant, "");
      return;
    }

    const parsedValue = Number(e.target.value);
    if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
      handleNewAmount(variant, e.target.value);
    }
  };

  const newAmount =
    activeInput === variant ? amount : Number(amount).toFixed(2);

  return (
    <div className="flex flex-col justify-between border rounded-16 gap-5 border-neutral-500 bg-neutral-600  p-4 w-full">
      <p className="text-neutral-100 text-preset-4 uppercase">
        {variant === "send" ? "Send" : "Receive"}
      </p>

      <div className="w-full flex justify-between items-center">
        <input
          className={`${variant === "receive" ? "text-lime-500 placeholder:text-lime-500" : "text-neutral-50 placeholder:text-neutral-50"} '
          w-7/10 max-w-7/10 outline-none text-preset-1 font-bold
          `}
          type="text"
          placeholder={newAmount}
          onChange={(e) => handleChange(e)}
          value={newAmount}
        />

        <p>{currency}</p>
      </div>
    </div>
  );
};

export default CurrencyInput;

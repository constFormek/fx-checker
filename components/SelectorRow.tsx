"use client";

import Image from "next/image";

import Icon from "./Icon";

import { inputVariant } from "./CurrencyInput";
import { CurrencyEntry } from "@/lib/currencyApi";

interface SelectorRowProps {
  entry: CurrencyEntry;
  currentCode: string;
  variant: inputVariant;
  changeCurrency: (input: inputVariant, code: string) => void;
  setIsOpen: (bool: boolean) => void;
}

const SelectorRow = ({
  entry,
  currentCode,
  variant,
  changeCurrency,
  setIsOpen,
}: SelectorRowProps) => {
  return (
    <button
      onClick={() => {
        changeCurrency(variant, entry.iso_code);
        setIsOpen(false);
      }}
      className="rounded-4 flex cursor-pointer items-center justify-between border border-transparent px-2 py-3 transition hover:border-neutral-200 focus-visible:outline-1 focus-visible:outline-lime-500"
    >
      <div className="flex items-center gap-3">
        <Image
          className="rounded-full"
          src={entry.flag}
          width={20}
          height={20}
          alt={``}
        />

        <p className="text-preset-4">{entry.iso_code}</p>

        <p className="text-preset-5 text-neutral-200">{entry.name}</p>
      </div>

      {currentCode === entry.iso_code && <Icon name="check" size={12} />}
    </button>
  );
};

export default SelectorRow;

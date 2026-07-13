"use client";

import Image from "next/image";

import Icon from "../Icon";

import { CurrencyEntry } from "@/lib/currencyApi";
import { useEffect, useRef } from "react";
import { optionId } from "@/lib/helpers";

interface SelectorRowProps {
  entry: CurrencyEntry;
  idPrefix: string;
  currentCode: string;
  isKeyboardActive: boolean;
  selectOption: (code: string) => void;
}

const SelectorRow = ({
  entry,
  idPrefix,
  currentCode,
  isKeyboardActive,
  selectOption,
}: SelectorRowProps) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isKeyboardActive) rowRef.current?.scrollIntoView({ block: "nearest" });
  }, [isKeyboardActive]);

  return (
    <div
      role="option"
      tabIndex={-1}
      aria-selected={currentCode === entry.iso_code}
      id={optionId(idPrefix, entry.iso_code)}
      ref={rowRef}
      onClick={() => {
        selectOption(entry.iso_code);
      }}
      className={`${isKeyboardActive ? "bg-lime-500" : "bg-transparent focus-visible:outline-1 focus-visible:outline-lime-500"} rounded-4 flex cursor-pointer items-center justify-between border border-transparent px-2 py-3 transition hover:border-neutral-200`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={entry.flag}
          width={24}
          height={24}
          alt=""
          className="rounded-full"
        />

        <p className="text-preset-4">{entry.iso_code}</p>

        <p className="text-preset-5 text-neutral-200">{entry.name}</p>
      </div>

      {currentCode === entry.iso_code && <Icon name="check" size={12} />}
    </div>
  );
};

export default SelectorRow;

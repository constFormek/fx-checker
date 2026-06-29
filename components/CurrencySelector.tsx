"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import { useCurrencies } from "@/lib/currenciesStore";
import SelectorRow from "./SelectorRow";
import { inputVariant } from "./CurrencyInput";
import { POPULAR_CODES } from "@/lib/constants";
import CategoryGroup from "./CategoryGroup";

export const optionId = (prefix: string, code: string) =>
  `${prefix}-option-${code}`;

interface CurrencySelectorProps {
  currentCode: string;
  variant: inputVariant;
  changeCurrency: (input: inputVariant, code: string) => void;
}

const CurrencySelector = ({
  currentCode,
  variant,
  changeCurrency,
}: CurrencySelectorProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const id = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const map = useCurrencies((s) => s.map);
  const list = useCurrencies((s) => s.list);

  const closeListbox = () => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        closeListbox();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (isOpen) searchInputRef.current?.focus();
    else {
      triggerButtonRef.current?.focus();
    }
  }, [isOpen]);

  const normalizedQuery = query.toLowerCase();

  const searchResults = list.filter((entry) => {
    const codeQuery = entry.iso_code.toLowerCase().includes(normalizedQuery);
    const nameQuery = entry.name.toLowerCase().includes(normalizedQuery);

    return codeQuery || nameQuery;
  });

  const popularEntries = list.filter((c) => POPULAR_CODES.includes(c.iso_code));
  const otherEntries = list.filter((c) => !POPULAR_CODES.includes(c.iso_code));

  const visibleOptions = query
    ? searchResults
    : [...popularEntries, ...otherEntries];

  const categoriesMap = [
    {
      label: "Popular",
      entries: popularEntries,
    },
    {
      label: "Other currencies",
      entries: otherEntries,
    },
  ]; // could also be moved and populated when the list will be available

  const selectOption = (code: string) => {
    changeCurrency(variant, code);
    closeListbox();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % visibleOptions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + visibleOptions.length) % visibleOptions.length,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (!visibleOptions[activeIndex]) break;
        selectOption(visibleOptions[activeIndex].iso_code);
        break;
      case "Escape":
        e.preventDefault();
        closeListbox();
        break;
      default:
        break;
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setActiveIndex(-1);
    setQuery(e.target.value);
  };

  const findCurrency = (code: string) => {
    const entry = map[code];

    return entry ? entry : { iso_code: code, flag: "/", name: "LOADING" };
  }; // can be moved outside

  const selectedCurrency = findCurrency(currentCode);

  return (
    <div className="md:relative" ref={containerRef}>
      <button
        ref={triggerButtonRef}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => isOpen ? closeListbox() : setIsOpen(true)}
        className="rounded-8 flex items-center gap-2 border-2 border-neutral-400 bg-neutral-500 p-2.5"
      >
        <Image
          className="rounded-full"
          src={selectedCurrency.flag}
          width={20}
          height={20}
          alt={`${selectedCurrency.name}`}
        />

        <p className="text-preset-4">{currentCode}</p>

        <Icon name="chevron-down" className="" size={24} />
      </button>

      <div
        className={`${isOpen ? "absolute" : "hidden"} rounded-8 top-full -right-0.5 -left-0.5 z-100 mt-2 flex max-h-122 flex-col gap-2.5 border-2 border-neutral-400 bg-neutral-600 p-2 md:right-0 md:left-auto md:w-94`}
      >
        <div className="rounded-6 flex items-center gap-2.5 border-2 border-neutral-200 p-3">
          <Icon name="search" size={24} />

          <label htmlFor={`${id}-search`} className="sr-only">
            Search currencies
          </label>

          <input
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${id}-listbox`}
            aria-activedescendant={
              visibleOptions[activeIndex] &&
              optionId(id, visibleOptions[activeIndex].iso_code)
            }
            ref={searchInputRef}
            id={`${id}-search`}
            type="text"
            placeholder="Search currencies..."
            className="text-preset-5 outline-none"
            onChange={handleChange}
            value={query}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
          />
        </div>

        <div
          role="listbox"
          aria-label="Currencies"
          id={`${id}-listbox`}
          className="flex flex-col gap-4 overflow-y-auto"
        >
          {query ? (
            searchResults.length > 0 ? (
              searchResults.map((entry) => (
                <SelectorRow
                  idPrefix={id}
                  key={entry.iso_code}
                  currentCode={currentCode}
                  selectOption={selectOption}
                  isKeyboardActive={entry === visibleOptions[activeIndex]}
                  entry={entry}
                />
              ))
            ) : (
              <p className="rounded-4 text-preset-4 border border-transparent px-2 py-3">
                No currencies found
              </p>
            )
          ) : (
            categoriesMap.map((category) => (
              <CategoryGroup
                idPrefix={id}
                key={category.label}
                label={category.label}
                entries={category.entries}
                currentCode={currentCode}
                activeEntry={visibleOptions[activeIndex]}
                selectOption={selectOption}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;

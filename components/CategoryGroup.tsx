import { CurrencyEntry } from "@/lib/currencyApi";
import SelectorRow from "./SelectorRow";
import { inputVariant } from "./CurrencyInput";

interface CategoryGroupProps {
  label: string;
  entries: CurrencyEntry[];
  currentCode: string;
  variant: inputVariant;
  changeCurrency: (input: inputVariant, code: string) => void;
  setIsOpen: (bool: boolean) => void;
}
const CategoryGroup = ({
  label,
  entries,
  currentCode,
  variant,
  changeCurrency,
  setIsOpen,
}: CategoryGroupProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-preset-5 flex w-full justify-between border-b-2 border-b-neutral-500 p-2 text-neutral-200">
        <p>{label.toUpperCase()}</p>

        <p>{entries.length}</p>
      </div>

      <div className="flex flex-col">
        {entries.map((entry) => (
          <SelectorRow
            key={entry.iso_code}
            currentCode={currentCode}
            variant={variant}
            changeCurrency={changeCurrency}
            setIsOpen={setIsOpen}
            entry={entry}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;

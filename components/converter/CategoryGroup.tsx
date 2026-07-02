import { CurrencyEntry } from "@/lib/currencyApi";
import SelectorRow from "./SelectorRow";

interface CategoryGroupProps {
  label: string;
  idPrefix: string;
  entries: CurrencyEntry[];
  currentCode: string;
  activeEntry: CurrencyEntry;
  selectOption: (code: string) => void;
}
const CategoryGroup = ({
  label,
  idPrefix,
  entries,
  currentCode,
  activeEntry,
  selectOption,
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
            idPrefix={idPrefix}
            key={entry.iso_code}
            currentCode={currentCode}
            selectOption={selectOption}
            isKeyboardActive={entry === activeEntry}
            entry={entry}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;

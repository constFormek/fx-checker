import { COMPARE_CODES } from "@/lib/constants";
import { useCurrencies } from "@/lib/currenciesStore";
import { formatAmount, getPairSnapshot } from "@/lib/helpers";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import { useRates } from "@/lib/hooks/useRates";
import { useShallow } from "zustand/shallow";
import ErrorMessage from "./ErrorMessage";

const Compare = () => {
  const { data, error, isPending } = useRates();

  const { list, base, setPair } = useCurrencies(
    useShallow((s) => ({
      list: s.list,
      base: s.pair.base,
      setPair: s.setPair,
    })),
  );
  const amount = useCurrencies((s) => {
    const n = Number(s.amount);
    return n > 0 ? n : null;
  });

  if (amount === null)
    return (
      <ErrorMessage
        label="No comparision available"
        text="Enter an amount in SEND above to see what your money is worth in other currencies."
      />
    );

  if (isPending) return <span>ŁADOWANIE</span>;
  if (error || list.length === 0) return <span>BŁĄD</span>;

  const compareCurrencies = COMPARE_CODES.filter((code) => code !== base).map(
    (code) => {
      const currency = list.find((c) => c.iso_code === code);

      if (!currency)
        throw new Error(
          `COMPARE_CODES contains "${code}" but it's not in supported currencies`,
        );

      const snapshot = getPairSnapshot(data, base, code);
      const convertedAmount =
        amount === null ? "-" : formatAmount(amount * snapshot.todaysRate);

      return {
        ...snapshot,
        ...currency,
        convertedAmount: convertedAmount,
      };
    },
  );

  const handleClick = (quoteCode: string) => {
    setPair(base, quoteCode);
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior: behavior });
  };

  const displayAmount = amount === null ? "-" : formatAmount(amount);

  return (
    <div className="rounded-16 flex w-full flex-col gap-4 border border-neutral-600 bg-neutral-700 p-4">
      <div className="flex w-full flex-col justify-between gap-2.5 uppercase">
        <h2 className="text-preset-4 flex flex-wrap gap-x-2 gap-y-2.5 text-neutral-200 uppercase">
          Multi-currency{" "}
          <span className="text-preset-3-medium whitespace-nowrap text-neutral-50">
            {displayAmount} from {base}
          </span>
        </h2>

        <p className="text-preset-5 text-neutral-200">
          {compareCurrencies.length} PAIRS
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {compareCurrencies.map((entry) => (
          <li
            key={entry.iso_code}
            className="rounded-10 flex items-center border border-neutral-500 bg-neutral-600 pr-3 transition-colors hover:border-neutral-300 has-[button:first-child:focus-visible]:outline-1 has-[button:first-child:focus-visible]:outline-offset-[2.5px] has-[button:first-child:focus-visible]:outline-lime-500 has-[button:first-child:focus-visible]:transition-none"
          >
            <button
              onClick={() => {
                handleClick(entry.iso_code);
              }}
              aria-label={`Load ${base}/${entry.iso_code} to converter`}
              className="rounded-10 flex grow cursor-pointer items-center gap-2.5 p-3 text-left focus-visible:outline-none"
            >
              <Image
                src={entry.flag}
                width={24}
                height={24}
                alt=""
                className="rounded-full"
              />

              <div className="flex flex-col gap-1.5">
                <p className="text-preset-4 text-neutral-50 uppercase">
                  {entry.iso_code}
                </p>

                <p className="text-preset-5 text-neutral-200">{entry.name}</p>
              </div>

              <div className="flex grow flex-col items-end gap-1.5">
                <p className="text-preset-3 text-neutral-50 uppercase">
                  {entry.convertedAmount}
                </p>

                <p className="text-preset-6 text-neutral-200">
                  @ {entry.todaysRate.toFixed(4)}
                </p>
              </div>
            </button>

            <FavoriteButton pair={{ base: base, quote: entry.iso_code }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Compare;

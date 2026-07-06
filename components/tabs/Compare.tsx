import { COMPARE_CODES } from "@/lib/constants";
import { useCurrencies } from "@/lib/currenciesStore";
import { formatAmount, getPairSnapshot } from "@/lib/helpers";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import { useRates } from "@/lib/hooks/useRates";

const Compare = () => {
  const { data, error, isPending } = useRates();

  const list = useCurrencies((s) => s.list);
  const amount = useCurrencies((s) => {
    const n = Number(s.amount);
    return n > 0 ? n : null;
  });

  const base = useCurrencies((s) => s.pair.base);

  if (isPending) return <span>ŁADOWANIE</span>;
  if (error) return <span>BŁĄD</span>;

  if (list.length === 0) return null;
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

  const displayAmount = amount === null ? "-" : formatAmount(amount);

  return (
    <div className="rounded-16 flex w-full flex-col gap-4 border border-neutral-600 bg-neutral-700 p-4">
      <div className="flex w-full flex-col justify-between gap-2.5 uppercase">
        <p className="text-preset-4 flex flex-wrap gap-x-2 gap-y-2.5 text-neutral-200 uppercase">
          Multi-currency{" "}
          <span className="text-preset-3-medium whitespace-nowrap text-neutral-50">
            {displayAmount} from {base}
          </span>
        </p>

        <p className="text-preset-5">{compareCurrencies.length} PAIRS</p>
      </div>

      <div className="flex flex-col gap-3">
        {compareCurrencies.map((entry) => (
          <div
            key={entry.iso_code}
            className="rounded-10 flex items-center gap-2.5 border border-neutral-500 bg-neutral-600 p-3"
          >
            <Image
              src={entry.flag}
              width={24}
              height={24}
              alt=""
              className="rounded-full"
            />

            <div className="flex grow flex-col gap-1.5">
              <p className="text-preset-5 text-neutral-50 uppercase">
                {entry.iso_code}
              </p>

              <p className="text-preset-5 text-neutral-200">{entry.name}</p>
            </div>

            <div className="flex shrink-0 gap-2.5">
              <div className="flex grow flex-col items-end gap-1.5">
                <p className="text-preset-3 text-neutral-50 uppercase">
                  {entry.convertedAmount}
                </p>

                <p className="text-preset-6 text-neutral-200">
                  @ {entry.todaysRate.toFixed(4)}
                </p>
              </div>

              <FavoriteButton pair={{ base: base, quote: entry.iso_code }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;

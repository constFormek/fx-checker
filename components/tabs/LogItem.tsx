import { Pair, useCurrencies } from "@/lib/currenciesStore";
import Icon from "../Icon";
import { formatTime } from "@/lib/helpers";

interface logItemProps {
  id: string;
  pair: Pair;
  timestamp: number;
  receiveAmount: string;
  sendAmount: string;
}

const LogItem = ({
  pair,
  timestamp,
  receiveAmount,
  sendAmount,
  id,
}: logItemProps) => {
  const timeElapsed = formatTime(timestamp);
  const deleteLog = useCurrencies((s) => s.deleteLog);
  return (
    <li className="rounded-10 flex w-full items-center justify-between border border-neutral-500 bg-neutral-600 px-4 py-3">
      <div className="flex flex-col gap-2 md:flex-row">
        <p className="max-w-16 text-neutral-200">{timeElapsed}</p>

        <div className="text-preset-4 flex flex-row items-center gap-2">
          {pair.base}
          <Icon name="arrow-right" size={12} className="text-neutral-200" />
          {pair.quote}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="text-preset-3 flex flex-col items-end gap-2 md:flex-row">
          <p className="text-neutral-50">{sendAmount}</p>

          <p className="text-lime-500">{receiveAmount}</p>
        </div>

        <button
          onClick={() => {
            deleteLog(id);
          }}
          className="rounded-8 cursor-pointer border border-neutral-500 bg-neutral-600 p-2 text-neutral-50 transition-colors hover:bg-neutral-500 focus-visible:outline-1 focus-visible:outline-offset-[2.5px] focus-visible:outline-lime-500"
        >
          <Icon name="delete" size={16} />
        </button>
      </div>
    </li>
  );
};

export default LogItem;

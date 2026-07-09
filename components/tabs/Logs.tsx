import { useCurrencies } from "@/lib/currenciesStore";
import LogItem from "./LogItem";
import ErrorMessage from "./ErrorMessage";

const Logs = () => {
  const logs = useCurrencies((s) => s.logs);
  const clearLogs = useCurrencies((s) => s.clearLogs);
  if (logs.length === 0)
    return (
      <ErrorMessage
        label="No conversions logged yet"
        text="Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser."
      />
    );

  return (
    <div className="rounded-16 flex w-full flex-col gap-4 border border-neutral-600 bg-neutral-700 p-4">
      <div className="flex w-full items-center justify-between uppercase">
        <p className="text-preset-3-medium">Conversion log</p>

        <div className="flex items-center justify-between">
          <p className="text-preset-5">{logs.length} LOGGED</p>

          <button
            onClick={clearLogs}
            className="text-preset-5 rounded-8 border border-neutral-400 bg-neutral-600 px-3 py-2 text-neutral-200 uppercase"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {logs.map((log) => (
          <LogItem
            key={log.id}
            id={log.id}
            sendAmount={log.sendAmount}
            pair={log.pair}
            timestamp={log.timestamp}
            receiveAmount={log.receiveAmount}
          />
        ))}
      </div>
    </div>
  );
};

export default Logs;

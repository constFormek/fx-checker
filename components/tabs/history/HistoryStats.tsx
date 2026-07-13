import ChangeIndicator, { stylesMap } from "@/components/ChangeIndicator";
import StatCard from "./StatCard";
import { calculateChange, getDirection } from "@/lib/helpers";

interface HistoryStatsProps {
  data: {
    date: string;
    rate: number;
  }[];
}
const HistoryStats = ({ data }: HistoryStatsProps) => {
  const openRate = data[0].rate;
  const lastRate = data[data.length - 1].rate;

  const changeObject = calculateChange(openRate, lastRate);
  const direction = getDirection(changeObject.change);

  const cards = [
    {
      label: "Open",
      content: (
        <p className="text-preset-2 text-neutral-50">{openRate.toFixed(4)}</p>
      ),
    },
    {
      label: "Last",
      content: (
        <p className="text-preset-2 text-neutral-50">{lastRate.toFixed(4)}</p>
      ),
    },
    {
      label: "Change",
      content: (
        <span
          className={`${stylesMap[direction].color} text-preset-2 flex items-center`}
        >
          {stylesMap[direction].prefix}
          {changeObject.change.toFixed(4)}
        </span>
      ),
    },
    {
      label: "% Change",
      content: (
        <ChangeIndicator
          changePercentage={changeObject.percentage}
          className="text-preset-2"
        />
      ),
    },
  ];
  return cards.map((c) => (
    <StatCard key={c.label} label={c.label}>
      {c.content}
    </StatCard>
  ));
};

export default HistoryStats;

import { CHART_STAT_LABELS } from "@/lib/constants";
import StatCard from "./StatCard";

interface HistoryStatsEmptyProps {
  isPending: boolean;
}

const HistoryStatsEmpty = ({ isPending }: HistoryStatsEmptyProps) => {
  return CHART_STAT_LABELS.map((label) => (
    <StatCard label={label} key={label}>
      -
    </StatCard>
  ));
};

export default HistoryStatsEmpty;

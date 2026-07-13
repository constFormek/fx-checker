import { CHART_STAT_LABELS } from "@/lib/constants";
import StatCard from "./StatCard";


const HistoryStatsEmpty = () => {
  return CHART_STAT_LABELS.map((label) => (
    <StatCard label={label} key={label}>
      -
    </StatCard>
  ));
};

export default HistoryStatsEmpty;

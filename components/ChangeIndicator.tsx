import { formatChange } from "@/lib/helpers";
import Icon from "./Icon";

export const stylesMap = {
  up: {
    color: "text-green-500",
    prefix: "+",
    Icon: <Icon name="chevron-down" className="h-[1em] w-[1em] rotate-180" />,
  },
  down: {
    color: "text-red-500",
    prefix: "-",
    Icon: <Icon name="chevron-down" className="h-[1em] w-[1em] rotate-0" />,
  },
  flat: { color: "text-neutral-200", prefix: "", Icon: <></> },
};

interface changeIndicatorProps {
  changePercentage: number;
  className?: string;
}

const ChangeIndicator = ({
  changePercentage,
  className,
}: changeIndicatorProps) => {
  const change = formatChange(changePercentage, 2);
  const direction = change.direction;
  return (
    <div
      className={`${stylesMap[direction].color} ${className ?? "text-preset-6"} flex items-center gap-1`}
    >
      {stylesMap[direction].Icon}

      {change.text}
    </div>
  );
};

export default ChangeIndicator;

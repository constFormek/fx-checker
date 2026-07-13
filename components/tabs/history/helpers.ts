import { FONT_SIZE, LABEL_GAP, TEXT_WIDTH } from "@/lib/constants";

type PlotDimensions = { width: number; height: number };
type ChartCoords = { x: number; y: number };
export type ChartData = {
  date: string;
  rate: number;
}[];

export const getRateBounds = (data: ChartData) => {
  const minRate = Math.min(...data.map((d) => d.rate));
  const maxRate = Math.max(...data.map((d) => d.rate));

  return {
    min: minRate,
    max: maxRate,
  };
};

export const formatChartDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
};

export const calculateX = (
  index: number,
  pointsCount: number,
  width: number,
) => {
  const t = index / pointsCount;
  const x = t * width;
  return x;
};
export const calculateY = (
  rate: number,
  minRate: number,
  maxRate: number,
  height: number,
) => {
  if (maxRate === minRate) return height / 2;
  const t = (rate - minRate) / (maxRate - minRate);

  const y = height - t * height;
  return y;
};

export const mapToChartCoords = (
  data: ChartData,
  plotDimensions: PlotDimensions,
) => {
  const rateBounds = getRateBounds(data);
  const pointsCount = data.length - 1;

  const chartCoords: ChartCoords[] = data.map((entry, index) => {
    const x = calculateX(index, pointsCount, plotDimensions.width);
    const y = calculateY(
      entry.rate,
      rateBounds.min,
      rateBounds.max,
      plotDimensions.height,
    );

    return {
      x: x,
      y: y,
    };
  });

  return chartCoords;
};

export const buildPathString = (data: { x: number; y: number }[]) => {
  const pathString = data
    .map((entry, index) => {
      if (index === 0) return `M ${entry.x} ${entry.y}`;

      return `L ${entry.x} ${entry.y}`;
    })
    .join(" ");

  return pathString;
};

export const buildAreaString = (
  pathString: string,
  plotDimensions: PlotDimensions,
) => {
  return `${pathString} L ${plotDimensions.width} ${plotDimensions.height} L 0 ${plotDimensions.height} Z`;
};

export const getLabelIndex = (i: number, k: number, lastIndex: number) => {
  const index = Math.round((i / (k - 1)) * lastIndex);
  return index;
};

export const getChartDimensions = (chartWidth: number, ratio: number) => {
  const plotWidth = chartWidth - LABEL_GAP - TEXT_WIDTH;
  const plotHeight = plotWidth / ratio;
  return {
    plotWidth,
    plotHeight,
    chartHeight: plotHeight + LABEL_GAP + FONT_SIZE,
  };
};

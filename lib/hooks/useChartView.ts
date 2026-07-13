"use client";

import { useEffect, useState } from "react";

type ChartView = {
  ratio: number;
  k: number;
};

const mobileConfig: ChartView = { ratio: 1, k: 3 };
const tabletConfig: ChartView = { ratio: 2.3, k: 5 };
const desktopConfig: ChartView = { ratio: 3.3, k: 5 };

const useChartView = () => {
  const [view, setView] = useState<ChartView>(mobileConfig);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const tablet = window.matchMedia("(min-width: 36rem)");

    const update = () => {
      if (desktop.matches) {
        setView(desktopConfig);
      } else if (tablet.matches) {
        setView(tabletConfig);
      } else {
        setView(mobileConfig);
      }
    };

    update();

    tablet.addEventListener("change", update);
    desktop.addEventListener("change", update);

    return () => {
      tablet.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  return view;
};

export default useChartView;

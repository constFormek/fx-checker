"use client";

import { useState } from "react";

import TabsList from "./TabsList";
import { TabsConfig, TabType } from "./config";
import { useCurrencies } from "@/lib/currenciesStore";

const Tabs = () => {
  const [activeTabId, setActiveTabId] = useState<TabType>("history");
  const logsCount = useCurrencies((s) => s.logs.length);
  const favortiesCount = useCurrencies((s) => s.favorites.length);

  const counts: Partial<Record<TabType, number>> = {
    log: logsCount,
    favorite: favortiesCount,
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <TabsList
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        counts={counts}
      />

      {TabsConfig.map((tab) => (
        <div
          key={tab.id}
          className={`${activeTabId === tab.id ? "block" : "hidden"}`}
        >
          <tab.Component />
        </div>
      ))}
    </div>
  );
};

export default Tabs;

"use client";

import { useState } from "react";

import TabsList from "./TabsList";
import { TabsConfig, TabType } from "./config";

const Tabs = () => {
  const [activeTabId, setActiveTabId] = useState<TabType>("history");

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsList activeTabId={activeTabId} setActiveTabId={setActiveTabId} />

      <div>
        {TabsConfig.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTabId === tab.id ? "block" : "hidden"}`}
          >
            <tab.Component />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

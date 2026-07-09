import { useId, useState } from "react";
import Icon from "../Icon";
import { TabsConfig, TabType } from "./config";
import { tabId } from "@/lib/helpers";

interface TabsListProps {
  activeTabId: TabType;
  setActiveTabId: (tab: TabType) => void;
}

const TabsList = ({ activeTabId, setActiveTabId }: TabsListProps) => {
  const handleClick = (tab: TabType) => {
    setActiveTabId(tab);
  };
  return (
    <div className="w-full">
      <div
        className="hidden w-full items-center gap-2 border-b border-b-neutral-600 md:flex"
        role="tablist"
      >
        {TabsConfig.map((tab) => (
          <button
            role="tab"
            aria-selected={activeTabId === tab.id}
            onClick={() => {
              handleClick(tab.id);
            }}
            key={tab.id}
            className={`${activeTabId === tab.id ? "border-b-lime-500" : "border-transparent"} text-preset-3 flex items-center gap-2 border-b px-4 pb-3 uppercase`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <MobileMenu activeTabId={activeTabId} setActiveTabId={setActiveTabId} />
    </div>
  );
};

export default TabsList;

interface MobileMenuProps {
  activeTabId: TabType;
  setActiveTabId: (tab: TabType) => void;
}

const MobileMenu = ({ activeTabId, setActiveTabId }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const id = useId();

  const activeTab = TabsConfig.find((t) => t.id === activeTabId);

  if (!activeTab) return null;
  return (
    <div className="relative block md:hidden z-0">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="rounded-8 text-preset-3 flex w-full items-center justify-between border border-neutral-400 bg-neutral-700 px-3 py-2 uppercase"
      >
        {activeTab.label}

        <Icon name="chevron-down" size={15} />
      </button>

      <div
        role="listbox"
        aria-label="Tabs"
        aria-activedescendant={tabId(id, activeTabId)}
        className={`${isOpen ? "absolute" : "hidden"} rounded-10 right-0 left-0 z-20 mt-2 flex max-h-122 flex-col border border-neutral-600 bg-neutral-700 p-2`}
      >
        {TabsConfig.map((tab) => (
          <div
            role="option"
            id={tabId(id, tab.id)}
            onClick={() => {
              setActiveTabId(tab.id);
              setIsOpen((o) => !o);
            }}
            aria-selected={activeTabId === tab.id}
            key={tab.id}
            className="text-preset-3 px-2 py-2.5 uppercase"
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

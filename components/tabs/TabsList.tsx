import { Fragment, useEffect, useId, useRef, useState } from "react";
import Icon from "../Icon";
import { TabsConfig, TabType } from "./config";
import { tabId } from "@/lib/helpers";

interface TabsListProps {
  activeTabId: TabType;
  setActiveTabId: (tab: TabType) => void;
  counts: Partial<Record<TabType, number>>;
}

const TabsList = ({ activeTabId, setActiveTabId, counts }: TabsListProps) => {
  const handleClick = (tab: TabType) => {
    setActiveTabId(tab);
  };
  return (
    <div className="w-full">
      <div
        className="hidden w-full items-center gap-2 border-b border-b-neutral-600 md:flex"
        role="tablist"
      >
        {TabsConfig.map((tab) => {
          const tabCount = counts[tab.id];
          return (
            <div key={tab.id} id={tab.label} className="relative" role="tabpanel" aria-labelledby={tab.label}>
              <button
                role="tab"
                aria-selected={activeTabId === tab.id}
                onClick={() => {
                  handleClick(tab.id);
                }}
                className={`${activeTabId === tab.id ? "border-b-lime-500" : "border-transparent hover:border-b-neutral-500"} text-preset-3 peer flex cursor-pointer items-center gap-2 border-b px-4 py-3 uppercase focus:outline-none`}
              >
                <p>{tab.label}</p>

                {tabCount != undefined && <CountBadge count={tabCount} />}
              </button>

              <span className="rounded-10 pointer-events-none absolute -inset-0.5 peer-focus-visible:outline-2 peer-focus-visible:outline-lime-500" />
            </div>
          );
        })}
      </div>

      <MobileMenu
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        counts={counts}
      />
    </div>
  );
};

export default TabsList;

interface MobileMenuProps {
  activeTabId: TabType;
  setActiveTabId: (tab: TabType) => void;
  counts: Partial<Record<TabType, number>>;
}

const MobileMenu = ({
  activeTabId,
  setActiveTabId,
  counts,
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  const closeListbox = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        closeListbox();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const activeTab = TabsConfig.find((t) => t.id === activeTabId);
  if (!activeTab) return null;

  const activeCount = counts[activeTab.id];
  return (
    <div ref={containerRef} className="relative z-0 block md:hidden">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="rounded-8 text-preset-3 flex w-full items-center justify-between border border-neutral-400 bg-neutral-700 px-3 py-2 uppercase"
      >
        <div className="flex items-center gap-2">
          {activeTab.label}

          {activeCount !== undefined && <CountBadge count={activeCount} />}
        </div>

        <Icon name="chevron-down" size={15} />
      </button>

      <div
        role="listbox"
        aria-label="Tabs"
        aria-activedescendant={tabId(id, activeTabId)}
        className={`${isOpen ? "absolute" : "hidden"} rounded-10 right-0 left-0 z-50 mt-2 flex max-h-122 flex-col border border-neutral-600 bg-neutral-700 p-2 drop-shadow-[0px_20px_60px_rgba(0,0,0,0.5)]`}
      >
        {TabsConfig.map((tab) => {
          const tabCount = counts[tab.id];
          return (
            <div
              role="option"
              id={tabId(id, tab.id)}
              onClick={() => {
                setActiveTabId(tab.id);
                setIsOpen((o) => !o);
              }}
              aria-selected={activeTabId === tab.id}
              key={tab.id}
              className="text-preset-3 flex items-center justify-between px-2 py-2.5 uppercase"
            >
              {tab.label}

              {tabCount !== undefined && <CountBadge count={tabCount} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface countBadgeProps {
  count: number;
}

const CountBadge = ({ count }: countBadgeProps) => {
  return (
    <div className="text-preset-6 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-lime-800 text-center text-lime-500">
      {count > 99 ? "99+" : count}
    </div>
  );
};

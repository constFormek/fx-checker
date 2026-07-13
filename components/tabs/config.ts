import Compare from "./Compare";
import Favorites from "./Favorites";
import History from "./history/History";
import Logs from "./Logs";

export const TabsConfig = [
  {
    id: "history",
    label: "History",
    Component: History,
  },

  {
    id: "compare",
    label: "Compare",
    Component: Compare,
  },

  {
    id: "favorite",
    label: "Favorites",
    Component: Favorites,
  },

  {
    id: "log",
    label: "Logs",
    Component: Logs,
  },
] as const;

export type TabType = (typeof TabsConfig)[number]["id"];

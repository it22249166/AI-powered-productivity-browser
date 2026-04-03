import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tab } from "../types/browser";

type BrowserState = {
  tabs: Tab[];
  navigationCommand: {
    tabId: string;
    action: "back" | "forward" | "reload" | "stop";
    timestamp: number;
  } | null;
  addTab: (workspaceId: string, url?: string, searchRegion?: "default" | "india") => void;
  closeTab: (id: string) => void;
  closeWorkspaceTabs: (workspaceId: string) => void;
  ensureWorkspaceTab: (workspaceId: string) => void;
  setActiveTab: (id: string) => void;
  updateTabUrl: (id: string, url: string, searchRegion?: "default" | "india") => void;
  updateTabState: (id: string, nextState: Partial<Tab>) => void;
  updateTabMemory: (id: string, memory: string) => void;
  requestNavigation: (tabId: string, action: "back" | "forward" | "reload" | "stop") => void;
};

const HOME_URL = "https://duckduckgo.com";

const createTab = (workspaceId: string, isActive: boolean, url = HOME_URL): Tab => ({
  id: crypto.randomUUID(),
  title: "New Tab",
  url,
  workspaceId,
  memory: "",
  isActive,
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
});

const normalizeUrl = (value: string, searchRegion: "default" | "india" = "default") => {
  const trimmed = value.trim();

  if (!trimmed) {
    return HOME_URL;
  }

  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const looksLikeUrl =
    trimmed.includes(".") ||
    trimmed.startsWith("localhost") ||
    trimmed.startsWith("127.0.0.1");

  if (hasProtocol) {
    return trimmed;
  }

  if (looksLikeUrl && !trimmed.includes(" ")) {
    const protocol = trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")
      ? "http://"
      : "https://";

    return `${protocol}${trimmed}`;
  }

  const params = new URLSearchParams({
    q: trimmed,
  });

  if (searchRegion === "india") {
    params.set("kl", "in-en");
    params.set("kc", "1");
    params.set("ia", "web");
  }

  return `https://duckduckgo.com/?${params.toString()}`;
};

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      tabs: [],
      navigationCommand: null,

      addTab: (workspaceId, url = HOME_URL, searchRegion = "default") =>
        set((state) => ({
          tabs: [
            ...state.tabs.map((tab) => ({
              ...tab,
              isActive: tab.workspaceId === workspaceId ? false : tab.isActive,
            })),
            createTab(workspaceId, true, normalizeUrl(url, searchRegion)),
          ],
        })),

      closeTab: (id) =>
        set((state) => {
          const target = state.tabs.find((tab) => tab.id === id);
          const tabs = state.tabs.filter((tab) => tab.id !== id);

          if (!target) {
            return state;
          }

          const workspaceTabs = tabs.filter((tab) => tab.workspaceId === target.workspaceId);
          if (target.isActive && workspaceTabs.length > 0) {
            workspaceTabs[workspaceTabs.length - 1].isActive = true;
          }

          return { tabs: [...tabs] };
        }),

      closeWorkspaceTabs: (workspaceId) =>
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.workspaceId !== workspaceId),
        })),

      ensureWorkspaceTab: (workspaceId) => {
        const workspaceTabs = get().tabs.filter((tab) => tab.workspaceId === workspaceId);
        if (workspaceTabs.length > 0) {
          if (!workspaceTabs.some((tab) => tab.isActive)) {
            get().setActiveTab(workspaceTabs[0].id);
          }
          return;
        }

        get().addTab(workspaceId);
      },

      setActiveTab: (id) =>
        set((state) => {
          const target = state.tabs.find((tab) => tab.id === id);
          if (!target) {
            return state;
          }

          return {
            tabs: state.tabs.map((tab) => {
              if (tab.workspaceId !== target.workspaceId) {
                return tab;
              }

              return {
                ...tab,
                isActive: tab.id === id,
              };
            }),
          };
        }),

      updateTabUrl: (id, url, searchRegion = "default") =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id
              ? {
                  ...tab,
                  url: normalizeUrl(url, searchRegion),
                  isLoading: true,
                }
              : tab
          ),
        })),

      updateTabState: (id, nextState) =>
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, ...nextState } : tab)),
        })),

      updateTabMemory: (id, memory) =>
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, memory } : tab)),
        })),

      requestNavigation: (tabId, action) =>
        set({
          navigationCommand: {
            tabId,
            action,
            timestamp: Date.now(),
          },
        }),
    }),
    {
      name: "intentra-browser",
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<BrowserState> | undefined;

        return {
          ...currentState,
          ...persisted,
          tabs: (persisted?.tabs || []).map((tab) => ({
            memory: "",
            ...tab,
          })),
        };
      },
    }
  )
);

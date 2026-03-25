import { create } from "zustand";
import { Tab } from "../types/browser";

type BrowserState = {
  tabs: Tab[];
  addTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabUrl: (id: string, url: string) => void;
};

const defaultTab: Tab = {
  id: crypto.randomUUID(),
  title: "New Tab",
  url: "https://www.google.com",
  isActive: true,
};

export const useBrowserStore = create<BrowserState>((set) => ({
  tabs: [defaultTab],

  addTab: () =>
    set((state) => ({
      tabs: [
        ...state.tabs.map((tab) => ({ ...tab, isActive: false })),
        {
          id: crypto.randomUUID(),
          title: "New Tab",
          url: "https://www.google.com",
          isActive: true,
        },
      ],
    })),

  closeTab: (id) =>
    set((state) => {
      const filtered = state.tabs.filter((tab) => tab.id !== id);
      if (filtered.length === 0) return { tabs: [defaultTab] };
      if (!filtered.some((tab) => tab.isActive)) filtered[0].isActive = true;
      return { tabs: [...filtered] };
    }),

  setActiveTab: (id) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => ({
        ...tab,
        isActive: tab.id === id,
      })),
    })),

  updateTabUrl: (id, url) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === id ? { ...tab, url } : tab
      ),
    })),
}));
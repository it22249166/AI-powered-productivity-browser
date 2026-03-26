import { create } from "zustand";
import type { Tab } from "../types/browser";

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

export const useBrowserStore = create<BrowserState>((set: any) => ({
    tabs: [defaultTab],

    addTab: () =>
        set((state: BrowserState) => ({
            tabs: [
                ...state.tabs.map((tab: Tab) => ({ ...tab, isActive: false })),
                {
                    id: crypto.randomUUID(),
                    title: "New Tab",
                    url: "https://www.google.com",
                    isActive: true,
                },
            ],
        })),

    closeTab: (id: string) =>
        set((state: BrowserState) => {
            const filtered = state.tabs.filter((tab: Tab) => tab.id !== id);
            if (filtered.length === 0) return { tabs: [defaultTab] };
            if (!filtered.some((tab: Tab) => tab.isActive)) filtered[0].isActive = true;
            return { tabs: [...filtered] };
        }),

    setActiveTab: (id: string) =>
        set((state: BrowserState) => ({
            tabs: state.tabs.map((tab: Tab) => ({
                ...tab,
                isActive: tab.id === id,
            })),
        })),

    updateTabUrl: (id: string, url: string) =>
        set((state: BrowserState) => ({
            tabs: state.tabs.map((tab: Tab) =>
                tab.id === id ? { ...tab, url } : tab
            ),
        })),
}));
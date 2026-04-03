import { create } from "zustand";
import { persist } from "zustand/middleware";

type RegionState = {
  searchRegion: "default" | "india";
  setSearchRegion: (region: "default" | "india") => void;
};

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      searchRegion: "default",
      setSearchRegion: (region) => set({ searchRegion: region }),
    }),
    {
      name: "intentra-region",
    }
  )
);

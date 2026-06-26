import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Region, PredictionResponse } from "./types";

/** Region filter — selected on home / used across atlas + explore. */
interface RegionState {
  region: Region;
  setRegion: (r: Region) => void;
}

export const useRegion = create<RegionState>((set) => ({
  region: "global",
  setRegion: (region) => set({ region }),
}));

/** Compare bench — up to 3 track URLs the user is comparing. */
interface CompareState {
  urls: string[];
  setUrl: (i: number, url: string) => void;
  clear: () => void;
}

export const useCompare = create<CompareState>((set) => ({
  urls: ["", "", ""],
  setUrl: (i, url) =>
    set((s) => {
      const next = [...s.urls];
      next[i] = url;
      return { urls: next };
    }),
  clear: () => set({ urls: ["", "", ""] }),
}));

/** Recent prediction history — persisted to localStorage (last 20). */
interface HistoryItem {
  id: string;
  name: string;
  artist: string;
  verdict: string;
  probability: number;
  at: number;
}

interface HistoryState {
  items: HistoryItem[];
  push: (p: PredictionResponse) => void;
  clear: () => void;
}

export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      push: (p) =>
        set((s) => {
          const item: HistoryItem = {
            id: p.track.id,
            name: p.track.name,
            artist: p.track.artist,
            verdict: p.prediction.verdict,
            probability: p.prediction.hit_probability,
            at: Date.now(),
          };
          const deduped = s.items.filter((x) => x.id !== item.id);
          return { items: [item, ...deduped].slice(0, 20) };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "algorhythm-history" },
  ),
);

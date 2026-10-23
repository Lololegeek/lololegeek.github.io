import { create } from "zustand";

export type StageMode = "intro" | "project" | "languages";

type State = {
  mode: StageMode;
  projectId: string | null;
  openId: string | null;
  paletteOpen: boolean;
  setStage: (mode: StageMode, projectId?: string | null) => void;
  open: (id: string | null) => void;
  setPalette: (open: boolean) => void;
};

export const useSite = create<State>((set) => ({
  mode: "intro",
  projectId: null,
  openId: null,
  paletteOpen: false,
  setStage: (mode, projectId = null) => set({ mode, projectId }),
  open: (openId) => set({ openId, paletteOpen: false }),
  setPalette: (paletteOpen) => set({ paletteOpen }),
}));

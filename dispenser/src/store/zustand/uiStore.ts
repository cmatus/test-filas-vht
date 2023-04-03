import { create } from "zustand";

import { IUI } from "@/interfaces/ui";

interface uiState {
  footerButtons: ("logo" | "home" | "back" | "exit")[];
  activity: string;
  isLoading: boolean;
  isError: boolean;
  error: string;
  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => void;
  setActivity: (activity: "cdt" | "lab" | "farmacy") => void;
}

export const uiStore = create<uiState>((set) => ({
  footerButtons: [],
  activity: "",
  isLoading: false,
  isError: false,
  error: "",

  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => {
    set((state) => ({ ...state, footerButtons: buttons }));
  },

  setActivity: (activity: "cdt" | "lab" | "farmacy") => {
    set((state) => ({ ...state, activity: activity }));
  },
}));

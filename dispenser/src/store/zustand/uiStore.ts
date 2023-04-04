import { create } from "zustand";

import { IUI } from "@/interfaces/ui";

interface uiState {
  footerButtons: ("logo" | "home" | "back" | "exit")[];
  activity: ("cdt" | "lab" | "farmacy") | null;
  option: string;
  preferential: string;
  isLoading: boolean;
  isError: boolean;
  error: string;
  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => void;
  setActivity: (activity: "cdt" | "lab" | "farmacy") => void;
  setOption: (option: string) => void;
  setPreferential: (preferential: string) => void;
}

export const uiStore = create<uiState>((set) => ({
  footerButtons: [],
  activity: null,
  option: "",
  preferential: "",
  isLoading: false,
  isError: false,
  error: "",

  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => {
    set((state) => ({ ...state, footerButtons: buttons }));
  },

  setActivity: (activity: "cdt" | "lab" | "farmacy") => {
    set((state) => ({ ...state, activity: activity }));
  },

  setOption: (option: string) => {
    set((state) => ({ ...state, option: option }));
  },

  setPreferential: (preferential: string) => {
    set((state) => ({ ...state, preferential: preferential }));
  },
}));

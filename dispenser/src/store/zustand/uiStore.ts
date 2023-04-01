import { create } from "zustand";

import { IUI } from "@/interfaces/ui";

interface uiState {
  footerButtons: ("logo" | "home" | "back" | "exit")[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => void;
}

export const uiStore = create<uiState>((set) => ({
  footerButtons: [],
  isLoading: false,
  isError: false,
  error: "",

  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => {
    set((state) => ({ ...state, footerButtons: buttons }));
  },
}));

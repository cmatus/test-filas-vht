import { create } from "zustand";

import { IUser } from "@/interfaces/user";

interface userState {
  user: IUser;
  isLoading: boolean;
  isError: boolean;
  error: string;
  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => void;
}

const initDataUser = {
  rut: "",
  name: "",
  paternalLastName: "",
  maternalLastName: "",
  fullName: "",
  samplingOrders: [],
};

export const userStore = create<userState>((set) => ({
  user: initDataUser,
  isLoading: false,
  isError: false,
  error: "",

  setFooterButtons: (buttons: ("logo" | "home" | "back" | "exit")[]) => {
    set((state) => ({ ...state, footerButtons: buttons }));
  },
}));

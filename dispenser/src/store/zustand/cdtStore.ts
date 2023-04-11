import { create } from "zustand";

import { apiInstance } from "@/utils/api";
import { cdtConfig } from "@/utils/config";

import { ICDTUser } from "@/interfaces/cdtUser";
import { IAppointment } from "./../../interfaces/appointment";

interface cdtState {
  user: ICDTUser | null;
  appointment: IAppointment[] | null;
  isLoading: boolean;
  isError: boolean;
  error: string;
  getData: (rut: string) => void;
}

export const cdtStore = create<cdtState>((set) => ({
  user: null,
  appointment: null,
  isLoading: false,
  isError: false,
  error: "",

  getData: async (rut: string) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const targetUrl = `${cdtConfig.server}/totem_hhha/citas/obtener/rut/${rut}/establecimiento_id/${cdtConfig.establishmentId}/format/json`;
      const response = await apiInstance.get("/proxy", {
        headers: {
          "x-target-url": targetUrl,
          "X-Api-Key": cdtConfig.apiKey,
        },
      });
      const data = response.data;
      set((state) => ({
        ...state,
        user: data.DATOS_PACIENTE[0],
        appointment: data.CITAS,
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({ ...state, isLoading: false, isError: true, error }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));

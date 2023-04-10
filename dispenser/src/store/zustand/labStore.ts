import { create } from "zustand";

import { apiInstance } from "@/utils/api";
import { labConfig } from "@/utils/config";

import { ILabData, ILabUser } from "@/interfaces/labUser";

interface labState {
  labData: ILabData;
  isLoading: boolean;
  isError: boolean;
  error: string;
  getLabData: (method: string, rut: string) => void;
}

export const labStore = create<labState>((set) => ({
  labData: {
    validacion: "",
    resultado: {
      solicitud: [],
      solicitudes: {},
    },
    tipo: "",
  },
  isLoading: false,
  isError: false,
  error: "",

  getLabData: async (method: string, rut: string) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const targetUrl = `${labConfig.server}/api/apiTotem/${method}/${rut}`;
      const response = await apiInstance.get("/proxy", {
        headers: {
          "x-target-url": targetUrl,
          "x-api-key": labConfig.apiKey,
        },
      });

      if (response.data.validacion !== "003") {
        throw new Error(response.data.tipo);
      }
      set((state) => ({ ...state, labData: response.data, error: "" }));
    } catch (error: any) {
      set((state) => ({ ...state, isError: true, error: error.message }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));

import { create } from "zustand";

import { apiInstance } from "@/utils/api";
import { cdtConfig } from "@/utils/config";

import { ICDTUser } from "@/interfaces/cdtUser";
import { IAppointment } from "./../../interfaces/appointment";

interface cdtState {
  user: ICDTUser[];
  appointment: IAppointment[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  getData: (rut: string) => void;
}

const initDataUser = [
  {
    PERSONA_ID: null,
    RUT: "",
    DV: "",
    RUT_COMPLETO: "",
    NOMBRES: "",
    APELLIDO_PAT: "",
    APELLIDO_MAT: "",
    NOMBRE_SOCIAL: "",
    NOMBRE_COMPLETO: "",
    FECHA_NACIMIENTO: "",
    GENERO_DESC: "",
    ESTADO_CIVIL_DESC: "",
    OCUPACION_DESC: "",
    RUT_REPRESENTANTE_LEGAL: "",
    DV_REPRESENTANTE_LEGAL: "",
    REPRESENTANTE_LEGAL: "",
    PUEBLO_ORIGINARIO_DESC: "",
    PAIS_DESC: "",
    PRAIS: "",
    PREVISION: "",
    CELULAR: "",
    CIUDAD: "",
    COMUNA: "",
    DIRECCION: "",
    EMAIL: "",
    FECHA_FALLECIMIENTO: null,
  },
];

const initDataAppointment = [
  {
    CUENTA_CORRIENTE: "",
    ID_HORA_MEDICA: 0,
    NUMERO_FICHA_LOCAL: 0,
    PACIENTE_ID: 0,
    PACIENTE_RUT: "",
    MODALIDA_ATENCION: "",
    MODALIDA_ATENCION_ID: 0,
    POLICLINICO: "",
    MODULO: "",
    BOX: "",
    NOMBRE_PROFESIONAL: "",
    APELLIDO_PAT_PROFESIONAL: "",
    APELLIDO_MAT_PROFESIONAL: "",
    ID_PROFESIONAL: 0,
    ATENCION_FECHA: "",
    ATENCION_HORA: "",
  },
];

export const cdtStore = create<cdtState>((set) => ({
  user: initDataUser,
  appointment: initDataAppointment,
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
      console.log(data);
      set((state) => ({
        ...state,
        user: data,
        appointment: data,
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({ ...state, isLoading: false, isError: true, error }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));

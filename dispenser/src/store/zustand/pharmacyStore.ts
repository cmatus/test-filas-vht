import { create } from "zustand";

import { apiInstance } from "@/utils/api";
import { pharmacyConfig } from "@/utils/config";

import { ICDTUser } from "@/interfaces/cdtUser";
import { IRecipe } from "@/interfaces/recipe";

interface pharmacyState {
  user: ICDTUser[];
  recipe: IRecipe[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  setUser: (user: ICDTUser[]) => void;
  addUser: (user: ICDTUser) => void;
  setRecipe: (recipe: IRecipe[]) => void;
  addRecipe: (recipe: IRecipe) => void;
  getDataRut: (rut: string) => void;
  addDataRut: (rut: string) => void;
  getDataNumber: (number: string) => void;
  addDataNumber: (number: string) => void;
}

const initDataUser = [
  {
    PERSONA_ID: "",
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
    NOMBRE_PADRE: "",
    NOMBRE_MADRE: "",
    NOMBRE_PAREJA: "",
    URL_FOTO: "",
    PUEBLO_ORIGINARIO_DESC: "",
    PAIS_DESC: "",
    PRAIS: "",
    PREVISION_ID: "",
    PREVISION: "",
    CELULAR: "",
    COMUNA: "",
    CIUDAD: "",
    DIRECCION: "",
    EMAIL: "",
    FECHA_FALLECIMIENTO: null,
    SITUACION_DISCAPACIDAD: "",
    POLICLINICOS_ACTIVOS: [],
  },
];

const initDataRecipe = [
  {
    MV_RECETA_ID: "",
    TB_ENCABEZADO_TIPO_ID: "",
    TB_ENCABEZADO_TIPO_DESC: "",
    TB_ENCABEZADO_ESTADO_ID: "",
    TB_ENCABEZADO_ESTADO_DESC: "",
    TB_ENCABEZADO_ATENCION_ID: "",
    TB_ENCABEZADO_ATENCION_DESC: "",
    TB_ESTABLECIMIENTO_ID: "",
    TB_ESTABLECIMIENTO_DESC: "",
    MV_PERSONA_PACIENTE_ID: "",
    MV_PERSONA_PROFESIONAL_ID: "",
    TB_ESPECIALIDAD_ID: "",
    FECHA_ATENCION: "",
    FECHA_DIGITACION: "",
    SOLO_FECHA_DIGITACION: "",
    FECHA_VENCIMIENTO: "",
    FECHA_ENTREGA: "",
    FECHA_ENTREGA_SIN_HORA: "",
    FECHA_PRIMERA_ENTREGA: "",
    FECHA_PRIMERA_ENTREGA_SIN_HORA: "",
    PROCEDENCIA_ID: "",
    PROCEDENCIA_DESC: "",
    OBSERVACION: "",
    MV_ADMISION_URGENCIA_ID: "",
    RCE_MV_DETALLE_ID: "",
    MV_EPISODIO_ID: "",
  },
];

export const pharmacyStore = create<pharmacyState>((set) => ({
  user: initDataUser,
  recipe: initDataRecipe,
  isLoading: false,
  isError: false,
  error: "",

  setUser: (user: ICDTUser[]) => {
    set({ user });
  },

  addUser: (user: ICDTUser) => {
    set((state) => ({
      user: [...state.user, user],
    }));
  },

  setRecipe: (recipe: IRecipe[]) => {
    set({ recipe });
  },

  addRecipe: (recipe: IRecipe) => {
    set((state) => ({
      recipe: [...state.recipe, recipe],
    }));
  },

  getDataRut: async (rut: string) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const targetUrl = `${pharmacyConfig.server}/totem_hhha/recetas/obtener_por_rut`;
      const response = await apiInstance.post(
        "/proxy",
        {
          rut: rut,
          establecimiento_id: pharmacyConfig.establishmentId,
        },
        {
          headers: {
            "x-target-url": targetUrl,
            "X-Api-Key": pharmacyConfig.apiKey,
          },
        }
      );
      const data = response.data;
      set((state) => ({
        ...state,
        user: data,
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({ ...state, isLoading: false, isError: true, error }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  addDataRut: async (RUT: string) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const targetUrl = `${pharmacyConfig.server}/totem_hhha/recetas/obtener_por_rut`;
      const response = await apiInstance.post(
        "/proxy",
        {
          rut: RUT,
          establecimiento_id: pharmacyConfig.establishmentId,
        },
        {
          headers: {
            "x-target-url": targetUrl,
            "X-Api-Key": pharmacyConfig.apiKey,
          },
        }
      );
      const data = response.data;
      const rut = Object.keys(data)[0];

      set((state) => ({
        ...state,
        user: {
          ...state.user,
          [rut]: {
            ...(state.user && (state.user as { [key: string]: any })[rut]
              ? (state.user as { [key: string]: any })[rut]
              : {}),
            ...data[rut],
          },
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({ ...state, isLoading: false, isError: true, error }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  getDataNumber: async (number: string) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const targetUrl = `${pharmacyConfig.server}/totem_hhha/recetas/obtener_por_numero`;
      const response = await apiInstance.post(
        "/proxy",
        {
          numero: number,
          establecimiento_id: pharmacyConfig.establishmentId,
        },
        {
          headers: {
            "x-target-url": targetUrl,
            "X-Api-Key": pharmacyConfig.apiKey,
          },
        }
      );
      const data = response.data;
      set((state) => ({
        ...state,
        recipe: data,
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({ ...state, isLoading: false, isError: true, error }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  addDataNumber: async (number: string) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const targetUrl = `${pharmacyConfig.server}/totem_hhha/recetas/obtener_por_numero`;
      const response = await apiInstance.post(
        "/proxy",
        {
          numero: number,
          establecimiento_id: pharmacyConfig.establishmentId,
        },
        {
          headers: {
            "x-target-url": targetUrl,
            "X-Api-Key": pharmacyConfig.apiKey,
          },
        }
      );
      const data = response.data;

      set((state) => ({
        ...state,
        recipe: Array.isArray(state.recipe) ? [...state.recipe, ...data] : data,
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({ ...state, isLoading: false, isError: true, error }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));

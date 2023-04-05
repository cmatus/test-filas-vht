import { create } from "zustand";

import { ICDTUser } from "@/interfaces/cdtUser";
import { IRecipe } from "@/interfaces/recipe";

interface userState {
  user: ICDTUser[];
  recipe: IRecipe[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  setUser: (user: ICDTUser[]) => void;
  addUser: (user: ICDTUser) => void;
  setRecipe: (recipe: IRecipe[]) => void;
  addRecipe: (recipe: IRecipe) => void;
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

export const pharmacyStore = create<userState>((set) => ({
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
}));

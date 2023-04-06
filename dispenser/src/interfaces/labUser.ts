export interface ILabData {
  validacion: string;
  resultado: {
    solicitud: number[];
    solicitudes: {
      [key: string]: {
        sol_codigo: string;
        profesional: string;
        paciente: string;
        servicio: string;
        agendado: string;
        prioridad: string;
        examen: string[];
        edadPaciente: string;
        edad: number;
      }[];
    };
    [key: string]: string[] | { [key: string]: any };
  };
  tipo: string;
}

export interface ILabUser {
  rut: string;
  paciente: string;
  prioridad: string;
  edadPaciente: string;
  edad: number;
}

export const activitiesOptions = [
  {
    name: "samplings",
    text: "TOMA DE MUESTRAS",
    activity: "lab",
    path: "/rut",
  },
  {
    name: "scheduleSamplings",
    text: "SOLICITUD DE HORA PARA TOMA DE EXÁMENES",
    activity: "lab",
    path: "/rut",
  },
  {
    name: "scheduleResults",
    text: "SOLICITUD DE RESULTADOS DE EXÁMENES",
    activity: "lab",
    path: "/rut",
  },
  {
    name: "otherQueries",
    text: "OTRAS CONSULTAS",
    activity: "lab",
    path: "/preferential",
  },
  {
    name: "scheduledEntry",
    text: "INGRESO DE HORA AGENDADA",
    activity: "cdt",
    path: "/preferential",
  },
  {
    name: "emergencyClinicWithReferral",
    text: "POLICLÍNICO URGENCIA CON DOCUMENTO DE DERIVACIÓN",
    activity: "cdt",
    path: "/preferential",
  },
  {
    name: "otherRequests",
    text: "OTROS REQUERIMIENTOS",
    activity: "cdt",
    path: "/preferential",
  },
  {
    name: "pharmacyRut",
    text: "INGRESO CON RUT",
    activity: "farmacy",
    path: "/rut",
  },
  {
    name: "pharmacyRecipeNumber",
    text: "INGRESO CON NÚMERO DE RECETA",
    activity: "farmacy",
    path: "",
  },
  {
    name: "pharmacyNormalRecipe",
    text: "RECETA MANUAL",
    activity: "farmacy",
    path: "",
  },
];

export const referralOptions = [
  {
    name: "ophthalmology",
    text: "OFTALMOLOGÍA",
    activity: "cdt",
    path: "/directions",
  },
  {
    name: "adultTraumatology",
    text: "TRAUMATOLOGÍA ADULTO",
    activity: "cdt",
    path: "/directions",
  },
  {
    name: "otolaryngology",
    text: "OTORRINOLARINGOLOGÍA",
    activity: "cdt",
    path: "/directions",
  },
];

export const otherRequests = [
  {
    name: "followUpRequest",
    text: "SOLICITUD HORA CONTROL",
    activity: "cdt",
    path: "/directions",
  },
  {
    name: "referralOrProcedure",
    text: "INGRESO INTERCONSULTA Y/O PROCEDIMIENTO",
    activity: "cdt",
    path: "/directions",
  },
  {
    name: "processingExpensesHCNetwork",
    text: "TRAMITACIÓN DE PASAJES E IC RED",
    activity: "cdt",
    path: "/directions",
  },
];

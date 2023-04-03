import { useEffect, Fragment } from "react";

import SubMenu from "@/components/ui/SubMenu";

import { useUI } from "@/store/hooks";

import styles from "./Activities.module.scss";

const activitiesOptions = [
  {
    name: "",
    text: "TOMA DE MUESTRAS",
    activity: "lab",
    path: "/rut",
  },
  {
    name: "",
    text: "SOLICITUD DE HORA PARA TOMA DE EXÁMENES",
    activity: "lab",
    path: "/rut",
  },
  {
    name: "",
    text: "SOLICITUD DE RESULTADOS DE EXÁMENES",
    activity: "lab",
    path: "/rut",
  },
  {
    name: "",
    text: "OTRAS CONSULTAS",
    activity: "lab",
    path: "/preferential",
  },
  {
    name: "",
    text: "INGRESO DE HORA AGENDADA",
    activity: "cdt",
    path: "",
  },
  {
    name: "",
    text: "POLICLÍNICO URGENCIA CON DOCUMENTO DERIVACIÓN",
    activity: "cdt",
    path: "",
  },
  {
    name: "",
    text: "OTROS REQUERIMIENTOS",
    activity: "cdt",
    path: "",
  },
];

const Activities = () => {
  const { setFooterButtons, activity } = useUI();

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <Fragment>
      <h2>Por favor seleccione una opción</h2>
      <SubMenu
        options={activitiesOptions.filter((item) => item.activity === activity)}
      />
    </Fragment>
  );
};

export default Activities;

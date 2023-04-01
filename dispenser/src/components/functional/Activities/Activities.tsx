import { useEffect, Fragment } from "react";

import SubMenu from "@/components/ui/SubMenu";

import { useUI } from "@/store/hooks";

import styles from "./Activities.module.scss";

const activitiesOptions = [
  {
    name: "",
    text: "TOMA DE MUESTRAS",
    path: "/rut",
  },
  {
    name: "",
    text: "SOLICITUD DE HORA PARA TOMA DE EXÁMENES",
    path: "",
  },
  {
    name: "",
    text: "SOLICITUD DE RESULTADOS DE EXÁMENES",
    path: "",
  },
  {
    name: "",
    text: "OTRAS CONSULTAS",
    path: "",
  },
];

const Activities = () => {
  const { setFooterButtons } = useUI();

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <Fragment>
      <h2>Por favor seleccione una opción</h2>
      <SubMenu options={activitiesOptions} />
    </Fragment>
  );
};

export default Activities;

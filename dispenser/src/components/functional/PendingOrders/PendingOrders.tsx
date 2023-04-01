import { Fragment, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";

import SubMenu from "@/components/ui/SubMenu";

import styles from "./PendingOrders.module.scss";

import { useUI } from "@/store/hooks";

const pendingOptions = [
  {
    name: "",
    text: "VIENE A DEJAR UNA MUESTRA TOMADA",
    path: "/rut",
  },
  {
    name: "",
    text: "TOMARSE UNA NUEVA MUESTRA (RECHAZOS)",
    path: "",
  },
  {
    name: "",
    text: "OTRAS CONSULTAS",
    path: "",
  },
];

const PendingOrders = () => {
  const { setFooterButtons } = useUI();

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <Fragment>
      <h1>
        Bienvenido
        <br />
        SERGIO FLORES DURAN
      </h1>
      <h2>Porfavor seleccione una opción</h2>
      <SubMenu options={pendingOptions} />
    </Fragment>
  );
};

export default PendingOrders;

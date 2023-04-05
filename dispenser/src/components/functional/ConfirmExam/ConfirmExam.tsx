import { Fragment, useEffect } from "react";

import SubMenu from "@/components/ui/SubMenu";

import styles from "./PendingOrders.module.scss";

import { useUI } from "@/store/hooks";

/**
 * Componente que muestra opciones para confirmar  la toma del examen
 * @returns {JSX.Element} - El componente de React.
 */
const ConfirmExam = () => {
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
      <SubMenu />
    </Fragment>
  );
};

export default ConfirmExam;

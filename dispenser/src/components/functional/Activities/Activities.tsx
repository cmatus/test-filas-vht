import { useEffect, Fragment } from "react";

import SubMenu from "@/components/ui/SubMenu";

import { activitiesOptions } from "@/data/activitiesOptions";

import { useCDT, useUI } from "@/store/hooks";

import styles from "./Activities.module.scss";

/**
 * Componente principal para la sección de actividades
 * @returns {JSX.Element}
 */
const Activities = () => {
  const { setFooterButtons, activity } = useUI();
  const { user } = useCDT();

  console.log(user);
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

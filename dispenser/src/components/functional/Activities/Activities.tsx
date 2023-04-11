import { useEffect, Fragment } from "react";

import SubMenu from "@/components/ui/SubMenu";

import { activitiesOptions } from "@/data/activitiesOptions";

import { useCDT, useUI } from "@/store/hooks";

import styles from "./Activities.module.scss";
import { useRouter } from "next/router";

/**
 * Componente principal para la sección de actividades
 * @returns {JSX.Element}
 */
const Activities = () => {
  const router = useRouter();
  const { setFooterButtons, activity } = useUI();
  const { user } = useCDT();

  if (activity === "cdt" && user === null) {
    router.push("/preferential");
  }

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

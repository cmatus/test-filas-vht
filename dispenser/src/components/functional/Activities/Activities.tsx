import { useEffect, Fragment } from "react";

import SubMenu from "@/components/ui/SubMenu";

import { activitiesOptions } from "@/data/activitiesOptions";

import { useUI } from "@/store/hooks";

import styles from "./Activities.module.scss";

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

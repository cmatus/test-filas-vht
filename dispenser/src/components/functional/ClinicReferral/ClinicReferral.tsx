import { Fragment, useEffect, useState } from "react";

import { DATOS_PACIENTE } from "@/data/mockups/cdt";

import { referralOptions } from "@/data/activitiesOptions";

import styles from "./ScheduledEntry.module.scss";

import { useUI } from "@/store/hooks";
import SubMenu from "@/components/ui/SubMenu";

const ClinicReferral = () => {
  const { setFooterButtons } = useUI();

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <Fragment>
      <h1>
        Bienvenido/a
        <br />
        {DATOS_PACIENTE[0].NOMBRE_COMPLETO}
      </h1>
      <h2>Seleccione una opción</h2>
      <SubMenu options={referralOptions} />
    </Fragment>
  );
};

export default ClinicReferral;

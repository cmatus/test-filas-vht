import { useEffect, Fragment } from "react";
import { useRouter } from "next/router";

import OptionSelect from "../../ui/OptionSelect/index";

import { useUI } from "@/store/hooks";

interface IOption {
  name: string;
  text: string;
  className?: string;
  path?: string;
  onClick?: any;
}

const Preferential = () => {
  const router = useRouter();

  const { setFooterButtons, setPreferential, activity, option } = useUI();

  const handlePreferential = (name: string) => {
    setPreferential(name);
    if (
      activity === "cdt" &&
      option === "scheduledEntry" &&
      name !== "notPreferential"
    ) {
      return router.push("/welfare");
    }
    router.push({
      pathname: "/ticket",
      query: { preferential: name },
    });
  };

  const dataOptions: IOption[] = [
    {
      name: "notPreferential",
      text: "NO",
      className: "cancel",
      onClick: () => {
        handlePreferential("notPreferential");
      },
    },
    {
      name: "pregnant",
      text: "EMBARAZADA",
      className: "",
      onClick: () => {
        handlePreferential("pregnant");
      },
    },
    {
      name: "reducedMobility",
      text: "MOVILIDAD REDUCIDA",
      className: "",
      onClick: () => {
        handlePreferential("reducedMobility");
      },
    },
    {
      name: "wheelchair",
      text: "SILLA DE RUEDAS",
      className: "",
      onClick: () => {
        handlePreferential("wheelchair");
      },
    },
    {
      name: "disabilityCard",
      text: "CARNET DE DISCAPACIDAD",
      className: "",
      onClick: () => {
        handlePreferential("disabilityCard");
      },
    },
  ];

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <Fragment>
      <h2>Por favor seleccione una opción</h2>
      <OptionSelect
        title="¿ES USTED UN PACIENTE PREFERENCIAL?"
        subTitle="(Embarazadas, Tercera edad, Movilidad reducida, etc...)"
        icon="/images/icons/preferencial.png"
        options={dataOptions}
      />
    </Fragment>
  );
};

export default Preferential;

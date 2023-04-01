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

  const { setFooterButtons } = useUI();

  const dataOptions: IOption[] = [
    { name: "", text: "NO", className: "cancel" },
    { name: "", text: "EMBARAZADA", className: "" },
    { name: "", text: "MOVILIDAD REDUCIDA", className: "" },
    { name: "", text: "SILLA DE RUEDAS", className: "" },
    {
      name: "",
      text: "CARNET DE DISCAPACIDAD",
      className: "",
      onClick: () => {
        router.push("/ticket");
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
        subTitle="(Embarazadas, tercera Edad, movilidad reducida, etc.)"
        icon="/images/icons/preferencial.png"
        options={dataOptions}
      />
    </Fragment>
  );
};

export default Preferential;

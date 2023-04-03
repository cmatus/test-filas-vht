import { Fragment, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { useRouter } from "next/router";

import OptionSelect from "@/components/ui/OptionSelect";

import { samplingOrder } from "../../../data/mockups/laboratory";

import styles from "./SamplingOrders.module.scss";
import SubMenu from "@/components/ui/SubMenu";

import { useUI } from "@/store/hooks";

interface IOption {
  name: string;
  text: string;
  className?: string;
  path?: string;
  onClick?: any;
}

const otherOptions = [
  {
    name: "deliverSamplings",
    text: "ENTREGAR MUESTRAS",
    activity: "lab",
    path: "/preferential",
  },
  {
    name: "retakeSampling",
    text: "TOMARSE UNA NUEVA MUESTRA",
    activity: "lab",
    path: "/preferential",
  },
  {
    name: "otherQueries",
    text: "OTRAS CONSULTAS",
    activity: "lab",
    path: "/preferential",
  },
];

const SamplingOrders = () => {
  const router = useRouter();

  const { setFooterButtons } = useUI();

  const dataOptions: IOption[] =
    samplingOrder.resultado.solicitudes[16948832].map((item) => {
      return {
        name: "",
        text: ReactHtmlParser(
          `<p><b>Solicitud:</b>&nbsp;${item.sol_codigo}</p><br/>${item.examen[0]}<br/><br/><b>Solicitado por:</b>${item.profesional}`
        ),
        onClick: () => handleClickOrder(),
      };
    });

  const handleClickOrder = () => {
    router.push("/preferential");
  };

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
      {samplingOrder.resultado.solicitud.length > 0 ? (
        <>
          <h2>Tiene los siguientes exámenes por realizar</h2>
          <OptionSelect options={dataOptions} />
        </>
      ) : (
        <>
          <h2>No tiene solicitudes pendientes, seleccione una opción</h2>
          <SubMenu options={otherOptions} />
        </>
      )}
    </Fragment>
  );
};

export default SamplingOrders;

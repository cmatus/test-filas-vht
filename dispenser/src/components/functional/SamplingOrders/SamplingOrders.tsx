import { Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { useRouter } from "next/router";

import OptionSelect from "@/components/ui/OptionSelect";

import { samplingOrder } from "../../../data/mockups/laboratory";

import styles from "./SamplingOrders.module.scss";

interface IOption {
  name: string;
  text: string;
  className?: string;
  path?: string;
  onClick?: any;
}

const SamplingOrders = () => {
  const router = useRouter();

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

  return (
    <Fragment>
      <h1>
        Bienvenido
        <br />
        SERGIO FLORES DURAN
      </h1>
      <h2>Tiene los siguientes exámenes por realizar</h2>
      <OptionSelect options={dataOptions} />
    </Fragment>
  );
};

export default SamplingOrders;

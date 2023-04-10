import { Fragment, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { useRouter } from "next/router";

import OptionSelect from "@/components/ui/OptionSelect";

import { otherOptions } from "@/data/activitiesOptions";
import { samplingOrder } from "../../../data/mockups/laboratory";

import styles from "./SamplingOrders.module.scss";
import SubMenu from "@/components/ui/SubMenu";

import { useLab, useUI } from "@/store/hooks";

interface IOption {
  name: string;
  text: string;
  className?: string;
  path?: string;
  onClick?: any;
}

const SamplingOrders = () => {
  const router = useRouter();

  const { rut } = router.query;
  const queryRut = rut?.slice(-2) as string;

  const { setFooterButtons } = useUI();
  const { labData, error } = useLab();

  console.log(error);
  const dataOptions: IOption[] =
    labData?.resultado?.solicitudes[queryRut]?.map((item: any) => {
      return {
        name: "",
        text: ReactHtmlParser(
          `<p><b>Solicitud:</b>&nbsp;${item.sol_codigo}</p><br/>${item.examen[0]}<br/><br/><b>Solicitado por:</b>${item.profesional}`
        ),
        onClick: () => handleClickOrder(),
      };
    }) || [];

  const handleClickOrder = () => {
    router.push("/confirmExam");
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
      {labData && Object.keys(labData.resultado?.solicitudes)?.length > 0 ? (
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

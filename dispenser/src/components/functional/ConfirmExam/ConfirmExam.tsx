import { Fragment, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";

import SubMenu from "@/components/ui/SubMenu";

import styles from "./PendingOrders.module.scss";

import { useUI } from "@/store/hooks";

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

import { useRouter } from "next/router";

import { DATOS_PACIENTE } from "@/data/mockups/cdt";
import { samplingOrder } from "@/data/mockups/laboratory";
import { isSenior } from "@/utils/isSenior";

import styles from "./SubMenu.module.scss";

import { useUI } from "@/store/hooks";
interface IOption {
  name: string;
  text: string;
  activity: string;
  path: string;
}

interface ISubMenu {
  options?: IOption[];
}

interface ISubMenuOption {
  data: IOption;
}

const SubMenu = ({ options }: ISubMenu) => {
  return (
    <div className={styles.subMenu}>
      {options &&
        options.map((item, idx: number) => (
          <SubMenuOption key={idx} data={item} />
        ))}
      {!options && <SubMenuConfirmExam />}
    </div>
  );
};

const SubMenuOption = ({ data }: ISubMenuOption) => {
  const router = useRouter();

  const { setOption } = useUI();

  const handleClick = (data: IOption) => {
    setOption(data.name);
    if (data.name === ("scheduleSamplings" || "scheduleResults")) {
      if (isSenior(samplingOrder.resultado.solicitudes[16948832][0])) {
        return router.push("/ticket");
      } else {
        return router.push("/preferential");
      }
    }
    router.push(data.path);
  };

  return (
    <div className={styles.subMenuOption} onClick={() => handleClick(data)}>
      {data.text}
    </div>
  );
};

const SubMenuConfirmExam = () => {
  return (
    <div className={styles.buttonContainer}>
      <h3>¿Desea realizar el examen seleccionado?</h3>
      <div className={styles.buttonWrapper}>
        <button className={styles.confirmButton}>Si</button>
        <button className={styles.cancelButton}>No</button>
      </div>
    </div>
  );
};

export default SubMenu;

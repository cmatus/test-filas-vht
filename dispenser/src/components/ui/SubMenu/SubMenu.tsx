import { useRouter } from "next/router";

import styles from "./SubMenu.module.scss";

interface IOption {
  name: string;
  text: string;
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
  return (
    <div
      className={styles.subMenuOption}
      onClick={() => router.push(data.path)}
    >
      {data.text}
    </div>
  );
};

const SubMenuConfirmExam = () => {
  const options: IOption[] = [
    {
      name: "confirm",
      text: "Confirmar",
      path: "/confirm-exam",
    },
    {
      name: "cancel",
      text: "Cancelar",
      path: "/cancel-exam",
    },
  ];

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

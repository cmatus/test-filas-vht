import { useRouter } from "next/router";

import styles from "./SubMenu.module.scss";

import { useUI } from "@/store/hooks";
interface IOption {
  name: string; // El nombre de la opción.
  text: string; // El texto que se muestra en la opción.
  activity: string; // El nombre de la actividad a la que pertenece la opción.
  path: string; // La ruta a la que se redirige al hacer click en la opción.
}

interface ISubMenu {
  options?: IOption[]; // Las opciones del submenú.
}

interface ISubMenuOption {
  data: IOption; // Los datos de la opción del submenú.
}

/**
 * Componente de React que representa el submenú.
 * @param {ISubMenu} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente del submenú.
 */
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

/**
 * Componente de React que representa una opción del submenú.
 * @param {ISubMenuOption} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente de la opción del submenú.
 */
const SubMenuOption = ({ data }: ISubMenuOption) => {
  const router = useRouter();

  const { setOption } = useUI();

  const handleClick = (data: IOption) => {
    setOption(data.name);
    if (data.name === "emergencyClinicWithReferral") {
      return router.push("/preferential");
    }
    router.push(data.path);
  };

  return (
    <div className={styles.subMenuOption} onClick={() => handleClick(data)}>
      {data.text}
    </div>
  );
};

/**
 * Componente de React que representa la opción de confirmar examen del submenú.
 * @returns {JSX.Element} Componente de la opción de confirmar examen del submenú.
 */
const SubMenuConfirmExam = () => {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
      <h3>¿Desea realizar el examen seleccionado?</h3>
      <div className={styles.buttonWrapper}>
        <button
          className={styles.confirmButton}
          onClick={() => router.push("/preferential")}
        >
          Si
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => router.push("/")}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default SubMenu;

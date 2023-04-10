import { useRouter } from "next/router";

import styles from "./Menu.module.scss";

import { useUI } from "@/store/hooks";

interface IOption {
  name: "cdt" | "lab" | "pharmacy"; // El nombre de la opción.
  text: string; // El texto que se muestra en la opción.
  icon: string; // El nombre del archivo de la imagen que se muestra en la opción.
  path: string; // La ruta a la que se redirige al hacer click en la opción.
}

interface IMenu {
  options: IOption[]; // Las opciones del menú.
}

interface IMenuOption {
  data: IOption; // Los datos de la opción del menú.
}

/**
 * Componente de React que representa el menú.
 * @param {IMenu} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente del menú.
 */
const Menu = ({ options }: IMenu) => {
  return (
    <div className={styles.menu}>
      {options.map((item, idx: number) => (
        <MenuOption key={idx} data={item} />
      ))}
    </div>
  );
};

/**
 * Componente de React que representa una opción del menú.
 * @param {IMenuOption} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente de la opción del menú.
 */
const MenuOption = ({ data }: IMenuOption) => {
  const router = useRouter();

  const { setActivity } = useUI();

  /**
   * Maneja el evento 'click' de la opción del menú.
   * @param {IOption} data - Datos de la opción del menú.
   */
  const handleClick = (data: IOption) => {
    setActivity(data.name);
    router.push(data.path);
  };

  return (
    <div className={styles.menuOption} onClick={() => handleClick(data)}>
      <div>{data.text}</div>
      <div
        style={{
          backgroundImage: `url(/images/icons/menu/${data.icon})`,
        }}
      ></div>
    </div>
  );
};

export default Menu;

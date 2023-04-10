import styles from "./NavButton.module.scss";

interface INavButton {
  iconName: string; // El nombre del archivo de la imagen que se muestra en el botón.
  onClick?: () => void; // La función que se ejecuta al hacer click en el botón.
}

/**
 * Componente de React que representa un botón de navegación.
 * @param {INavButton} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente del botón de navegación.
 */
const NavButton = ({ iconName, onClick }: INavButton) => {
  return (
    <div
      className={styles.navButton}
      style={{
        backgroundImage: `url(/images/icons/footer/${iconName}.png)`,
      }}
      onClick={onClick}
    ></div>
  );
};

export default NavButton;

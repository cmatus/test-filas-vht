import styles from "./Screen.module.scss";

/**
 * Componente Screen
 * @param {React.ReactNode} props - Propiedades del componente
 * @returns {JSX.Element}
 */
const Screen = ({ children }: any) => {
  return <div className={styles.screen}>{children}</div>;
};

export default Screen;

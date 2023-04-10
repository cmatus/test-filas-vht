import styles from "./OptionSelect.module.scss";

interface IOptionSelect {
  title?: string; // El título del componente.
  subTitle?: string; // El subtítulo del componente.
  icon?: string; // El nombre del archivo de la imagen que se muestra en el componente.
  options: IOption[]; // Las opciones del componente.
}

interface IOption {
  name: string; // El nombre de la opción.
  text: string; // El texto que se muestra en la opción.
  className?: string; // La clase que se le agrega a la opción.
  path?: string; // La ruta a la que se redirige al hacer click en la opción.
  onClick?: any; // La función que se ejecuta al hacer click en la opción.
}

/**
 * Componente de React que representa un componente de selección de opciones.
 * @param {IOptionSelect} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente del componente de selección de opciones.
 */
const OptionSelect = ({ title, subTitle, icon, options }: IOptionSelect) => {
  return (
    <div className={styles.optionSelect}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {subTitle && <h2 className={styles.subTitle}>{subTitle}</h2>}
      {icon && (
        <div
          className={styles.icon}
          style={{ backgroundImage: `url(${icon})` }}
        ></div>
      )}
      <div className={styles.options}>
        {options.map((item, idx: number) => (
          <div
            className={
              styles.option +
              `${item.className !== "" ? " " + styles[item.className!] : ""}`
            }
            key={idx}
            onClick={item.onClick}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionSelect;

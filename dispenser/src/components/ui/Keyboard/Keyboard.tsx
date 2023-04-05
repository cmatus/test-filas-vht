import { useState, useEffect } from "react";

import { unFormatRut, formatRut } from "@/utils/format";
import { rutValidate, isValidRut } from "@/utils/validations";

import styles from "./Keyboard.module.scss";

interface IKeyboard {
  type?: string; // El tipo de teclado que se debe mostrar.
  maxlength?: number; // El número máximo de caracteres que se pueden ingresar.
  onClick?: () => void; // Función que se ejecuta cuando se presiona un botón.
  setTextValue: (text: string) => void; // Función que se ejecuta cuando se presiona un botón.
  textValue: string; // El texto que se muestra en el teclado.
}

/**
 * Componente para mostrar un teclado numérico que permite ingresar valores como el RUT o el número de receta.
 * @param {IKeyboard} props - Propiedades del teclado.
 * @returns {JSX.Element} Elemento React que muestra el teclado.
 */
const Keyboard = ({
  type = "rut",
  maxlength = 9,
  onClick,
  setTextValue,
  textValue,
}: IKeyboard) => {
  const [isEnabledConfirm, setIsEnabledConfirm] = useState(false);

  const isRutType = type === "rut";
  const isRecipeType = type === "recipe";

  /**
   * Maneja el evento click de un botón del teclado.
   * @param {string} char - Carácter que se ha pulsado.
   */
  const handleClickChar = (char: string) => {
    if (isRutType && unFormatRut(textValue).length < maxlength) {
      return setTextValue(formatRut(textValue + char));
    }
    if (isRecipeType && textValue.length < maxlength) {
      return setTextValue(textValue + char);
    }
  };

  /**
   * Maneja el evento click del botón "x" (borrar).
   */
  const handleClickDelete = () => {
    setTextValue("");
  };

  useEffect(() => {
    if (isRutType) {
      setIsEnabledConfirm(
        isValidRut(unFormatRut(textValue)) &&
          rutValidate(unFormatRut(textValue))
      );
    }
    if (isRecipeType) {
      setIsEnabledConfirm(true);
    }
  }, [textValue, isRutType, isRecipeType]);

  return (
    <div className={styles.keyboard}>
      <div className={styles.value}>{textValue}</div>
      <div className={styles.container}>
        <div className={styles.buttons}>
          <div className={styles.button} onClick={() => handleClickChar("1")}>
            1
          </div>
          <div className={styles.button} onClick={() => handleClickChar("2")}>
            2
          </div>
          <div className={styles.button} onClick={() => handleClickChar("3")}>
            3
          </div>
          <div className={styles.button} onClick={() => handleClickChar("4")}>
            4
          </div>
          <div className={styles.button} onClick={() => handleClickChar("5")}>
            5
          </div>
          <div className={styles.button} onClick={() => handleClickChar("6")}>
            6
          </div>
          <div className={styles.button} onClick={() => handleClickChar("7")}>
            7
          </div>
          <div className={styles.button} onClick={() => handleClickChar("8")}>
            8
          </div>
          <div className={styles.button} onClick={() => handleClickChar("9")}>
            9
          </div>
          <div className={styles.button} onClick={handleClickDelete}>
            x
          </div>
          <div className={styles.button} onClick={() => handleClickChar("0")}>
            0
          </div>
          {type === "rut" && (
            <div className={styles.button} onClick={() => handleClickChar("K")}>
              K
            </div>
          )}
          {type === "recipe" && (
            <div className={styles.button} onClick={() => handleClickChar(".")}>
              .
            </div>
          )}
        </div>
        <button
          className={styles.buttonConfirm}
          disabled={!isEnabledConfirm}
          onClick={onClick}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Keyboard;

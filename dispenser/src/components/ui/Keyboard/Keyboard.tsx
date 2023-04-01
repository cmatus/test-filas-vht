import { useState, useEffect } from "react";

import { unFormatRut, formatRut } from "@/utils/format";
import { rutValidate, isValidRut } from "@/utils/validations";

import styles from "./Keyboard.module.scss";

interface IKeyboard {
  type?: string;
  maxlength?: number;
  onClick?: any;
}

const Keyboard = ({ type = "rut", maxlength = 9, onClick }: IKeyboard) => {
  const [textValue, setTextValue] = useState("");
  const [isEnabledConfirm, setIsEnabledConfirm] = useState(false);

  const handleClickChar = (char: string) => {
    if (unFormatRut(textValue).length < maxlength) {
      setTextValue(formatRut(textValue + char));
    }
  };

  const handleClickDelete = () => {
    setTextValue("");
  };

  useEffect(() => {
    if (type === "rut") {
      setIsEnabledConfirm(
        isValidRut(unFormatRut(textValue)) &&
          rutValidate(unFormatRut(textValue))
      );
    }
  }, [textValue]);

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
        </div>
        <button
          className={styles.buttonConfirm}
          disabled={!isEnabledConfirm}
          onClick={onClick}>
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Keyboard;

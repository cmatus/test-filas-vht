import { useState, useEffect } from "react";

import styles from "./Modal.module.scss";

interface IModal {
  children: React.ReactNode; // JSX.Element | JSX.Element[];
  showModal: boolean; // Indica si se debe mostrar el modal.
}

/**
 * Componente Modal
 * @param {IModal} props - Propiedades del componente
 * @returns {JSX.Element}
 */
const Modal = ({ children, showModal }: IModal) => {
  const [isShowModal, setIsShowModal] = useState(showModal);

  useEffect(() => {
    setIsShowModal(showModal);
  }, [showModal]);

  return (
    <div
      className={styles.modal}
      style={{ display: isShowModal ? "flex" : "none" }}
    >
      {children}
    </div>
  );
};

interface IWindow {
  title?: string; // El título del componente Window.
  children: React.ReactNode; // JSX.Element | JSX.Element[];
  showCloseButton?: boolean; // Indica si se debe mostrar el botón de cerrar.
  setClosed?: () => void; // Función que se ejecuta cuando se cierra el componente.
}

/**
 * Componente Window
 * @param {IWindow} props - Propiedades del componente
 * @returns {JSX.Element}
 */
const Window = ({
  title = "",
  children,
  showCloseButton = true,
  setClosed,
}: IWindow) => {
  return (
    <div className={styles.window}>
      {(title !== "" || showCloseButton) && (
        <div className={styles.header}>
          <div className={styles.left}></div>
          <div className={styles.title}>{title}</div>
          <div className={styles.right}>
            {showCloseButton && (
              <div className={styles.closeButton} onClick={setClosed}>
                <span className="material-symbols-outlined">close</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export { Modal, Window };

import { Modal, Window } from "@/components/ui/Modal";

import styles from "./Loading.module.scss";

interface ILoading {
  text?: string; // El texto que se muestra en la animación de carga.
  show: boolean; // Indica si se debe mostrar la animación de carga.
}

/**
 * Componente que muestra una animación de carga con texto opcional.
 * @param {ILoading} props - Las propiedades del componente Loading.
 * @returns {JSX.Element} El componente Loading.
 */
const Loading = ({ text = "Por favor espere", show }: ILoading) => {
  return (
    <Modal showModal={show}>
      <Window showCloseButton={false}>
        <div className={styles.loading}>
          <div className={styles.iconLoadingSpin}></div>
          <div className={styles.loadingText}>{text}</div>
        </div>
      </Window>
    </Modal>
  );
};

export default Loading;

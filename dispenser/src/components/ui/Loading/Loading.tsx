import { Modal, Window } from "@/components/ui/Modal";

import styles from "./Loading.module.scss";

interface ILoading {
  text?: string;
  show: boolean;
}

const Loading = ({ text = "Por favor epere", show }: ILoading) => {
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

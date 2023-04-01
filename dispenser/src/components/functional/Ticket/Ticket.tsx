import styles from "./Ticket.module.scss";

const Ticket = () => {
  return (
    <div className={styles.ticket}>
      <div className={styles.container}>
        <div className={styles.text}>SU NÚMERO DE ATENCIÓN:</div>
        <div className={styles.number}>A12</div>
        <div className={styles.section}>Toma de muestras</div>
        <div className={styles.message}>
          DIRÍJASE A LA VENTANILLA DE ATENCIÓN GENERAL
        </div>
      </div>
    </div>
  );
};

export default Ticket;

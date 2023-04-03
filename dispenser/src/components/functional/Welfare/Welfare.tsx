import styles from "./Welfare.module.scss";

const Welfare = () => {
  return (
    <div className={styles.ticket}>
      <div className={styles.container}>
        <div className={styles.text}>SU TIPO DE PREVISIÓN:</div>
        <div className={styles.section}>
          DIPRECA <br />
          CAPREDENA
        </div>
        <div className={styles.buttonWrapper}>
          <button className={styles.confirmButton}>CONFIRMAR</button>
        </div>
      </div>
    </div>
  );
};

export default Welfare;

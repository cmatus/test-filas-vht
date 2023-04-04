import styles from "./Welfare.module.scss";

import { DATOS_PACIENTE } from "@/data/mockups/cdt";
import { useRouter } from "next/router";

const Welfare = () => {
  const router = useRouter();
  return (
    <div className={styles.ticket}>
      <div className={styles.container}>
        <div className={styles.text}>SU TIPO DE PREVISIÓN:</div>
        <div className={styles.section}>{DATOS_PACIENTE[0].PREVISION}</div>
        <div className={styles.buttonWrapper}>
          <button
            className={styles.confirmButton}
            onClick={() => router.push("/scheduledEntry")}
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welfare;

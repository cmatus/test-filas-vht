import { useRouter } from "next/router";

import styles from "./Welfare.module.scss";

import { useCDT, useUI } from "@/store/hooks";

const Welfare = () => {
  const router = useRouter();

  const { option } = useUI();
  const { user } = useCDT();

  const handleClick = () => {
    if (option === "emergencyClinicWithReferral") {
      return router.push("/clinicReferral");
    }
    return router.push("/directions");
  };

  return (
    <div className={styles.ticket}>
      <div className={styles.container}>
        <div className={styles.text}>SU TIPO DE PREVISIÓN:</div>
        <div className={styles.section}>{user?.PREVISION}</div>
        <div className={styles.buttonWrapper}>
          <button className={styles.confirmButton} onClick={handleClick}>
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welfare;

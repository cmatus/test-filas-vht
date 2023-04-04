import styles from "./Ticket.module.scss";

import { activitiesOptions } from "@/data/activitiesOptions";

import { useUI } from "@/store/hooks";

const Ticket = () => {
  const { activity } = useUI();

  const selectedActivity = activitiesOptions.find(
    (item) => item.activity === activity
  );

  return (
    <div className={styles.ticket}>
      <div className={styles.container}>
        <div className={styles.text}>SU NÚMERO DE ATENCIÓN:</div>
        <div className={styles.number}>A12</div>
        <div className={styles.section}>{selectedActivity?.text}</div>
        <div className={styles.message}>
          DIRÍJASE A LA VENTANILLA DE ATENCIÓN GENERAL
        </div>
      </div>
    </div>
  );
};

export default Ticket;

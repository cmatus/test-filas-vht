import { useEffect, useState } from "react";

import { generateTicketNumber } from "@/utils/randomTicket";

import {
  activitiesOptions,
  referralOptions,
  otherRequests,
} from "@/data/activitiesOptions";

import styles from "./Ticket.module.scss";

import { useUI } from "@/store/hooks";

const Ticket = () => {
  const [selectedOption, setSelectedOption] = useState<any>();
  const { setFooterButtons, option } = useUI();

  useEffect(() => {
    const allOptions = [
      ...referralOptions,
      ...activitiesOptions,
      ...otherRequests,
    ];
    const optionMap = allOptions.reduce((map: any, option) => {
      map[option.name] = option;
      return map;
    }, {});
    if (optionMap[option]?.activity === "pharmacy") {
      return setSelectedOption({
        text: "FARMACIA",
      });
    }
    setSelectedOption(optionMap[option]);
    setFooterButtons(["home", "exit"]);
  }, []);

  return (
    <div className={styles.ticket}>
      <div className={styles.container}>
        <div className={styles.text}>SU NÚMERO DE ATENCIÓN:</div>
        <div className={styles.number}>{generateTicketNumber()}</div>
        <div className={styles.section}>{selectedOption?.text}</div>
        <div className={styles.message}>
          DIRÍJASE A LA VENTANILLA DE ATENCIÓN GENERAL
        </div>
      </div>
    </div>
  );
};

export default Ticket;

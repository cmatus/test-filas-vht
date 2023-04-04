import { Fragment, useEffect, useState } from "react";

import { DATOS_PACIENTE, CITAS } from "@/data/mockups/cdt";
import { getClosestAppointment, formatTime } from "@/utils/dateTime";

import styles from "./ScheduledEntry.module.scss";

import { useUI } from "@/store/hooks";
import { useRouter } from "next/router";
import Image from "next/image";

const ScheduledEntry = () => {
  const [appointment, setAppointment] = useState<any>(null);
  const { setFooterButtons } = useUI();

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  useEffect(() => {
    setAppointment(getClosestAppointment(CITAS));
  }, [CITAS]);

  return (
    <Fragment>
      <h1>
        Bienvenido
        <br />
        {DATOS_PACIENTE[0].NOMBRE_COMPLETO}
      </h1>
      {appointment ? (
        <>
          <h2>
            Usted {appointment?.timeDifference < 0 ? "tenía" : "tiene"} una hora
            con <br />
            <span className={styles.schedule}>
              DR/A.{" "}
              {appointment?.appointment?.NOMBRE_PROFESIONAL +
                " " +
                appointment?.appointment?.APELLIDO_PAT_PROFESIONAL}{" "}
              a las {formatTime(appointment?.appointment?.ATENCION_HORA)} hrs
            </span>
          </h2>
          <Appointment timeDifference={appointment?.timeDifference} />
        </>
      ) : (
        <NoAppointment />
      )}
    </Fragment>
  );
};

export default ScheduledEntry;

const Appointment = ({ timeDifference }: any) => {
  const router = useRouter();

  const { preferential } = useUI();

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {timeDifference < 0 ? (
          <div className={styles.time}>
            <h2>
              Dado a que ha llegado tarde a su hora de citación, se evaluará su
              factibilidad. Por favor dirígase al módulo [MODULO] para continuar
              su atención. Como registra previsión [PREVISIÓN] se solicitará
              dirigirse a caja posterior a confirmación.
            </h2>
            <button
              className={styles.button}
              onClick={() =>
                router.push({
                  pathname: "/ticket",
                  query: { preferential: preferential },
                })
              }
            >
              Continuar
            </button>
          </div>
        ) : timeDifference <= 5 ? (
          <div className={styles.time}>
            <h1>¡Ya es hora de su cita!</h1>
            <button
              className={styles.button}
              onClick={() =>
                router.push({
                  pathname: "/ticket",
                  query: { preferential: preferential },
                })
              }
            >
              Continuar
            </button>
          </div>
        ) : timeDifference <= 20 ? (
          <div className={styles.time}>
            <h1>¡Su cita está próxima!</h1>
            <button
              className={styles.button}
              onClick={() =>
                router.push({
                  pathname: "/ticket",
                  query: { preferential: preferential },
                })
              }
            >
              Continuar
            </button>
          </div>
        ) : timeDifference > 20 ? (
          <div className={styles.time}>
            <Image
              src="/images/icons/warning.png"
              alt="ícono advertencia"
              width={286}
              height={286}
            />
            <p>
              ESTIMADO USUARIO POR FAVOR VUELVA MÁS TARDE PARA SER INGRESADO.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const NoAppointment = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>No tiene citas programadas</h1>
        <h2>
          Estimado paciente, ud. no registra citación para el día de hoy. Favor
          continúe para generar un ticket de atención y ser atendido en el mesón
          de admisión, hall CDT.
        </h2>
        <div className="buttonWrapper">
          <button
            className={styles.button}
            onClick={() => router.push("/preferential")}
          >
            Generar Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

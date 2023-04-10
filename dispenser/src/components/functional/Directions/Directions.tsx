import { Fragment, useEffect, useState } from "react";

import { CITAS } from "@/data/mockups/cdt";
import { getClosestAppointment, formatTime } from "@/utils/dateTime";

import styles from "./Directions.module.scss";

import { useCDT, useUI } from "@/store/hooks";
import { useRouter } from "next/router";
import Image from "next/image";

const Directions = () => {
  const [appointment, setAppointment] = useState<any>(null);

  const { setFooterButtons, option } = useUI();
  const { user, appointment: citas } = useCDT();

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  useEffect(() => {
    setAppointment(getClosestAppointment(citas));
  }, [citas]);

  console.log(appointment);

  return (
    <Fragment>
      <h1>
        Bienvenido/a
        <br />
        {user?.NOMBRE_COMPLETO}
      </h1>
      {option === "scheduledEntry" ? (
        appointment ? (
          <>
            <h2>
              Usted{" "}
              {appointment?.appointment?.timeDifference < 0 ? "tenía" : "tiene"}{" "}
              una hora con <br />
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
        )
      ) : ["ophthalmology", "adultTraumatology", "otolaryngology"].includes(
          option
        ) ? (
        <Referral />
      ) : [
          "followUpRequest",
          "referralOrProcedure",
          "processingExpensesHCNetwork",
        ].includes(option) ? (
        <OtherRequests />
      ) : null}
    </Fragment>
  );
};

export default Directions;

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

  const { preferential } = useUI();

  const handleClick = () => {
    if (preferential !== "") {
      router.push({
        pathname: "/ticket",
        query: { preferential: preferential },
      });
    } else {
      router.push("/preferential");
    }
  };
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
          <button className={styles.button} onClick={handleClick}>
            Generar Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

const Referral = () => {
  const router = useRouter();

  const { user } = useCDT();

  const welfare = user?.PREVISION;
  const [message, setMessage] = useState<string>(() => {
    if (["DIPRECA", "CAPREDENA", "FONASA", "PRAIS"].includes(welfare)) {
      return `Estimado usuario, por favor dirigirse a módulo D con documento de derivación
      y esperar su turno donde se evaluará factibilidad de atención.`;
    } else if (welfare === "SIN PREVISIÓN" || welfare === "FONASA BLOQUEADO") {
      return `Estimado usuario, hemos detectado problemas con su previsión.
          Se solicita dirigirse a Servicio Social para regularizar.`;
    } else {
      return `Estimado usuario, ud. registra previsión particular, por lo que no es posible gestionar su solicitud. 
            En caso de requerir actualizar su previsión dirigirse a Servicio Social.
            Para aclarar dudas espere su llamado en mesón de admisión, hall CDT.`;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>Indicaciones</h1>
        <h2>{message}</h2>
        <div className="buttonWrapper">
          {welfare !== "SIN PREVISIÓN" && welfare !== "FONASA BLOQUEADO" ? (
            <button
              className={styles.button}
              onClick={() => router.push("/ticket")}
            >
              Generar Ticket
            </button>
          ) : (
            <button className={styles.button} onClick={() => router.push("/")}>
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OtherRequests = () => {
  const router = useRouter();
  const { option } = useUI();
  const { appointment } = useCDT();
  const [message, setMessage] = useState<string>(() => {
    if (appointment?.length > 0 && option === "followUpRequest") {
      return `Estimado usuario, por favor espere su llamado en mesón de admisión, hall CDT.`;
    } else if (!appointment && option === "followUpRequest") {
      return `Estimado usuario, ud. no presenta especialidad activa en control. Por favor espere su llamado en mesón de admisión, hall CDT.`;
    } else {
      return `Estimado usuario, por favor dirigirse a ventanilla N° XX y esperar su turno.`;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>Indicaciones</h1>
        <h2>{message}</h2>
        <div className="buttonWrapper">
          <button
            className={styles.button}
            onClick={() => router.push("/ticket")}
          >
            Generar Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

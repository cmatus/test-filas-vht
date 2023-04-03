import { Fragment, useEffect, useState } from "react";

import SubMenu from "@/components/ui/SubMenu";

import { DATOS_PACIENTE, CITAS } from "@/data/mockups/cdt";

import styles from "./ScheduledEntry.module.scss";

import { useUI } from "@/store/hooks";
import { useRouter } from "next/router";
import Image from "next/image";

interface IOption {
  name: string;
  text: string;
  className?: string;
  path?: string;
  onClick?: any;
}

const ScheduledEntry = () => {
  const [appointment, setAppointment] = useState<any>(null);
  const { setFooterButtons } = useUI();

  const formatTime = (time: string) => {
    const hours = time?.slice(0, 2);
    const minutes = time?.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: string) => {
    const year = date?.slice(0, 4);
    const month = date?.slice(4, 6);
    const day = date?.slice(6, 10);
    return `${day}/${month}/${year}`;
  };

  const getClosetAppointment = () => {
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    const todayHours = today.getHours();
    const todayMinutes = today.getMinutes();

    const todayDateFormatted = `${
      todayDate < 10 ? "0" + todayDate : todayDate
    }${todayMonth < 10 ? "0" + todayMonth : todayMonth}${todayYear}`;
    const todayTimeFormatted = `${
      todayHours < 10 ? "0" + todayHours : todayHours
    }${todayMinutes < 10 ? "0" + todayMinutes : todayMinutes}`;

    const appointments = CITAS.filter((appointment) => {
      const appointmentDate = formatDate(appointment.ATENCION_FECHA);
      const appointmentTime = formatTime(appointment.ATENCION_HORA);
      const appointmentDateFormatted = appointmentDate.replace(/\//g, "");
      const appointmentTimeFormatted = appointmentTime.replace(/\:/g, "");

      if (
        appointmentDateFormatted >= todayDateFormatted &&
        (appointmentTimeFormatted >= todayTimeFormatted ||
          appointmentTimeFormatted < todayTimeFormatted)
      ) {
        return appointment;
      }
    });

    if (appointments.length > 0) {
      const closestAppointment = appointments[0];
      const closestDate = formatDate(closestAppointment.ATENCION_FECHA);
      const closestTime = formatTime(closestAppointment.ATENCION_HORA);
      const closestDateTime = new Date(`${closestDate} ${closestTime}`);
      const timeDiffMs = closestDateTime.getTime() - today.getTime();
      const timeDiffMin = Math.floor(timeDiffMs / 60000);

      return {
        appointment: closestAppointment,
        timeDifference: timeDiffMin,
      };
    } else {
      return null;
    }
  };

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  useEffect(() => {
    setAppointment(getClosetAppointment());
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
          <Appointment
            appointment={appointment?.appointment}
            timeDifference={appointment?.timeDifference}
          />
        </>
      ) : (
        <NoAppointment />
      )}
    </Fragment>
  );
};

export default ScheduledEntry;

const Appointment = ({ appointment, timeDifference }: any) => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {timeDifference <= 0 ? (
          <div className={styles.time}>
            <h2>
              Dado a que ha llegado tarde a su hora de citación, se evaluará su
              factibilidad. Por favor dirígase al módulo [MODULO] para continuar
              su atención. Como registra previsión [PREVISIÓN] se solicitará
              dirigirse a caja posterior a confirmación.
            </h2>
            <button className={styles.button}>Generar Ticket</button>
          </div>
        ) : timeDifference <= 5 ? (
          <div className={styles.time}>
            <h1>¡Ya es hora de su cita!</h1>
            <button className={styles.button}>Generar Ticket</button>
          </div>
        ) : timeDifference <= 20 ? (
          <div className={styles.time}>
            <h1>¡Su cita está próxima!</h1>
            <button className={styles.button}>Generar Ticket</button>
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
            onClick={() => router.push("/ticket")}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

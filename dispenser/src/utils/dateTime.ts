export const formatTime = (time: string) => {
  const hours = time?.slice(0, 2);
  const minutes = time?.slice(2, 4);
  return `${hours}:${minutes}`;
};

export const formatDate = (date: string) => {
  const year = date?.slice(0, 4);
  const month = date?.slice(4, 6);
  const day = date?.slice(6, 8);
  return `${year}-${month}-${day}`;
};

export const getClosestAppointment = (data: any) => {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  const todayHours = today.getHours();
  const todayMinutes = today.getMinutes();

  const todayDateFormatted = `${todayYear}${
    todayMonth < 10 ? "0" + todayMonth : todayMonth
  }${todayDate < 10 ? "0" + todayDate : todayDate}`;
  const todayTimeFormatted = `${
    todayHours < 10 ? "0" + todayHours : todayHours
  }${todayMinutes < 10 ? "0" + todayMinutes : todayMinutes}`;

  const timeDiffs: any = [];
  const appointments = data.filter((appointment: any) => {
    const appointmentDate = appointment.ATENCION_FECHA;
    const appointmentTime = appointment.ATENCION_HORA;

    if (
      appointmentDate >= todayDateFormatted &&
      appointmentTime >= todayTimeFormatted
    ) {
      const appointmentDateTime = new Date(
        `${formatDate(appointmentDate)} ${formatTime(appointmentTime)}`
      );
      const timeDiffMs = appointmentDateTime.getTime() - today.getTime();
      const timeDiffMin = Math.floor(timeDiffMs / 60000);
      timeDiffs.push(timeDiffMin);
      return appointment;
    }
  });

  if (appointments.length > 0) {
    const minTimeDiff = Math.min(...timeDiffs);
    const closestAppointmentIndex = timeDiffs.findIndex(
      (diff: any) => diff === minTimeDiff
    );
    const closestAppointment = appointments[closestAppointmentIndex];
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

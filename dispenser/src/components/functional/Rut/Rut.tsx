import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";

import { DATOS_PACIENTE } from "@/data/mockups/farmacy";

import { samplingOrder } from "@/data/mockups/laboratory";
import { isSenior } from "@/utils/isSenior";

import Keyboard from "@/components/ui/Keyboard";
import Loading from "@/components/ui/Loading";

import { usePharmacy, useUI } from "@/store/hooks";

const Rut = () => {
  const router = useRouter();

  const { additional } = router.query;

  const { setFooterButtons, activity, option } = useUI();
  const { setUser, addUser } = usePharmacy();

  const [showLoading, setShowLoading] = useState(false);

  const handleConfirm = () => {
    setShowLoading(true);
    setTimeout(() => {
      if (["scheduleSamplings", "scheduleResults"].includes(option)) {
        if (isSenior(samplingOrder.resultado.solicitudes[16948832][0])) {
          router.push("/ticket");
        } else {
          router.push("/preferential");
        }
      } else if (activity === "lab" && option === "samplings") {
        router.push("/samplingOrders");
      } else if (activity === "pharmacy" && option !== "pharmacyNormalRecipe") {
        if (!additional) {
          setUser(DATOS_PACIENTE);
        } else {
          addUser(DATOS_PACIENTE[0]);
        }
        router.push({
          pathname: "/additional",
          query: { type: "rut" },
        });
      } else {
        router.push("/activities");
      }

      setShowLoading(false);
    }, 2000);
  };

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <Fragment>
      <h2>Por favor ingrese su Rut</h2>
      <Keyboard onClick={handleConfirm} />
      <Loading show={showLoading} />
    </Fragment>
  );
};

export default Rut;

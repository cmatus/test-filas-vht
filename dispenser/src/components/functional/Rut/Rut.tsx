import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";

import { samplingOrder } from "@/data/mockups/laboratory";
import { isSenior } from "@/utils/isSenior";

import Keyboard from "@/components/ui/Keyboard";
import Loading from "@/components/ui/Loading";

import { useUI } from "@/store/hooks";

const Rut = () => {
  const router = useRouter();

  const { setFooterButtons, activity, option } = useUI();

  const [showLoading, setShowLoading] = useState(false);

  const handleConfirm = () => {
    setShowLoading(true);
    setTimeout(() => {
      if (option === ("scheduleSamplings" || "scheduleResults")) {
        if (isSenior(samplingOrder.resultado.solicitudes[16948832][0])) {
          return router.push("/ticket");
        } else {
          return router.push("/preferential");
        }
      }
      if (activity === "lab" && option === "samplings") {
        router.push("/samplingOrders");
      } else if (activity === "pharmacy" && option !== "pharmacyNormalRecipe") {
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

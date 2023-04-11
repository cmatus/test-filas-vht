import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";

import { samplingOrder } from "@/data/mockups/laboratory";
import { isSenior } from "@/utils/isSenior";
import { formatRutRequest } from "@/utils/format";

import Keyboard from "@/components/ui/Keyboard";
import Loading from "@/components/ui/Loading";

import { useCDT, useLab, usePharmacy, useUI } from "@/store/hooks";

const Rut = () => {
  const [rut, setRut] = useState("");
  const router = useRouter();

  const { additional } = router.query;

  const { setFooterButtons, activity, option } = useUI();
  const { getLabData } = useLab();
  const { addDataRut, getDataRut } = usePharmacy();
  const { getData: getCDTData } = useCDT();

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
        getLabData("1", formatRutRequest(rut));
        router.push("/samplingOrders", {
          query: { rut: formatRutRequest(rut) },
        });
      } else if (activity === "pharmacy" && option !== "pharmacyNormalRecipe") {
        if (!additional) {
          getDataRut(formatRutRequest(rut));
        } else {
          addDataRut(formatRutRequest(rut));
        }
        router.push({
          pathname: "/additional",
          query: { type: "rut" },
        });
      } else {
        getCDTData(formatRutRequest(rut));
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
      <Keyboard onClick={handleConfirm} setTextValue={setRut} textValue={rut} />
      <Loading show={showLoading} />
    </Fragment>
  );
};

export default Rut;

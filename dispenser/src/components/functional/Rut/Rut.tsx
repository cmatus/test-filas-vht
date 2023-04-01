import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";

import Keyboard from "@/components/ui/Keyboard";
import Loading from "@/components/ui/Loading";

import { useUI } from "@/store/hooks";

const Rut = () => {
  const router = useRouter();

  const { setFooterButtons } = useUI();

  const [showLoading, setShowLoading] = useState(false);

  const handleConfirm = () => {
    setShowLoading(true);
    setTimeout(() => {
      router.push("/samplingOrders");
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

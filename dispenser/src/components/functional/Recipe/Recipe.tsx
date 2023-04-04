import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";

import { samplingOrder } from "@/data/mockups/laboratory";

import Keyboard from "@/components/ui/Keyboard";
import Loading from "@/components/ui/Loading";

import { useUI } from "@/store/hooks";

const Recipe = () => {
  const router = useRouter();

  const { setFooterButtons, activity, option } = useUI();

  const [showLoading, setShowLoading] = useState(false);

  const handleConfirm = () => {
    setShowLoading(true);
    setTimeout(() => {
      router.push({
        pathname: "/additional",
        query: { type: "recipe" },
      });
      setShowLoading(false);
    }, 2000);
  };

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <Fragment>
      <h2>Por favor ingrese su número de receta</h2>
      <Keyboard onClick={handleConfirm} type="recipe" />
      <Loading show={showLoading} />
    </Fragment>
  );
};

export default Recipe;

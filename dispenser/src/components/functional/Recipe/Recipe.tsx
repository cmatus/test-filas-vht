import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";

import { RECETAS } from "@/data/mockups/farmacy";

import Keyboard from "@/components/ui/Keyboard";
import Loading from "@/components/ui/Loading";

import { usePharmacy, useUI } from "@/store/hooks";

const Recipe = () => {
  const [textRecipe, setTextRecipe] = useState("");
  const router = useRouter();

  const { additional } = router.query;

  const { setFooterButtons } = useUI();
  const { setRecipe, addRecipe } = usePharmacy();

  const [showLoading, setShowLoading] = useState(false);

  const handleConfirm = () => {
    setShowLoading(true);
    setTimeout(() => {
      if (!additional) {
        setRecipe(RECETAS);
      } else {
        addRecipe(RECETAS[0]);
      }
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
      <Keyboard
        onClick={handleConfirm}
        type="recipe"
        setTextValue={setTextRecipe}
        textValue={textRecipe}
      />
      <Loading show={showLoading} />
    </Fragment>
  );
};

export default Recipe;

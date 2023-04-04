import { useRouter } from "next/router";

import { DATOS_PACIENTE } from "@/data/mockups/cdt";

import styles from "./Additional.module.scss";

import { useUI } from "@/store/hooks";
import Image from "next/image";
import { useEffect } from "react";

const Additional = () => {
  const router = useRouter();

  const { type } = router.query;
  const { setFooterButtons, option } = useUI();

  useEffect(() => {
    setFooterButtons(["back", "home", "exit"]);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {type === "rut"
          ? "¿DESEA AGREGAR UN RUT ADICIONAL PARA SU RECETA?"
          : "¿DESEA AGREGAR UN NÚMERO ADICIONAL PARA SU RECETA?"}
      </div>
      <div className={styles.subText}>
        * Solo si comprará medicamentos para más de una persona.
      </div>
      <div className={styles.imageContainer}>
        {type === "rut" ? (
          <Image
            src={"/images/icons/add_userIcon.png"}
            alt="agregar usuario por rut"
            height={222}
            width={202}
          />
        ) : (
          <Image
            src={"/images/icons/add_recipe.png"}
            alt="agregar usuario por rut"
            height={222}
            width={306}
          />
        )}
      </div>
      <div className={styles.buttonWrapper}>
        <button
          className={styles.confirmButton}
          onClick={() => {
            type === "rut" ? router.push("/rut") : router.push("/recipe");
          }}
        >
          SI
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => router.push("/preferential")}
        >
          NO
        </button>
      </div>
    </div>
  );
};

export default Additional;

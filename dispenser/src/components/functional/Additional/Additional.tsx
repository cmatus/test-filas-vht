import { useRouter } from "next/router";

import styles from "./Additional.module.scss";

import { usePharmacy, useUI } from "@/store/hooks";
import Image from "next/image";
import { useEffect } from "react";

/**
 * Componente que consulta al usuario si desea agregar un rut o número de receta adicional.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.type - Tipo de rut o número de receta adicional.
 * @returns {JSX.Element} - El componente de React.
 */
const Additional = () => {
  const router = useRouter();

  const { type } = router.query;
  const { setFooterButtons } = useUI();
  const { user } = usePharmacy();

  console.log(user);
  const handleClick = (type: string) => {
    if (type === "rut") {
      router.push({
        pathname: "/rut",
        query: { additional: true },
      });
    } else if (type === "recipe") {
      router.push({
        pathname: "/recipe",
        query: { additional: true },
      });
    }
  };

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
          onClick={() => handleClick(type as string)}
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

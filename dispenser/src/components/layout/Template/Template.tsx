import { useRouter } from "next/router";

import Screen from "../Screen";

import NavButton from "@/components/ui/NavButton";
import VigatecLogo from "@/components/ui/VigatecLogo";

import styles from "./Template.module.scss";
import Head from "next/head";

interface ITemplate {
  children: React.ReactNode; // Los componentes que se renderizarán en el template.
  footerComponents: ("logo" | "home" | "back" | "exit")[]; // Los componentes que se mostrarán en el footer.
}

interface IFooter {
  components: ("logo" | "home" | "back" | "exit")[]; // Los componentes que se mostrarán en el footer.
}

/**
 * Componente de React que representa el template de la aplicación.
 * @param {ITemplate} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente del template de la aplicación.
 */
const Template = ({ children, footerComponents }: ITemplate) => {
  return (
    <Screen>
      <Head>
        <title>TOTEM - Hospital Doctor Hernán Hneriquez Aravena</title>
        <meta name="description" content="TOTEM by Vigatec" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.template}>
        <Header />
        <Body>{children}</Body>
        <Footer components={footerComponents} />
      </div>
    </Screen>
  );
};

/**
 * Componente de React que representa el header del template.
 * @returns {JSX.Element} Componente del header del template.
 */
const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo01}></div>
      <div className={styles.logo02}></div>
    </div>
  );
};

/**
 * Componente de React que representa el body del template.
 * @param {React.PropsWithChildren<{}>} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente del body del template.
 */
const Body = ({ children }: any) => {
  return <div className={styles.body}>{children}</div>;
};

/**
 * Componente de React que representa el footer del template.
 * @param {IFooter} props - Propiedades que recibe el componente.
 * @returns {JSX.Element} Componente del footer del template.
 */
const Footer = ({ components }: IFooter) => {
  const router = useRouter();

  const componentsArray = {
    back: <NavButton iconName="back" onClick={() => router.back()} />,
    home: <NavButton iconName="home" onClick={() => router.push("/")} />,
    exit: <NavButton iconName="exit" />,
    logo: <VigatecLogo />,
  };

  return (
    <div className={styles.footer}>
      {components.map((item) => componentsArray[item])}
    </div>
  );
};

export default Template;

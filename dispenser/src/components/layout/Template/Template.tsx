import { useRouter } from "next/router";

import Screen from "../Screen";

import NavButton from "@/components/ui/NavButton";
import VigatecLogo from "@/components/ui/VigatecLogo";

import styles from "./Template.module.scss";
import Head from "next/head";

interface ITemplate {
  children: any;
  footerComponents: ("logo" | "home" | "back" | "exit")[];
}

interface IFooter {
  components: ("logo" | "home" | "back" | "exit")[];
}

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

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo01}></div>
      <div className={styles.logo02}></div>
    </div>
  );
};

const Body = ({ children }: any) => {
  return <div className={styles.body}>{children}</div>;
};

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

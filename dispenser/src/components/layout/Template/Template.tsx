import { useRouter } from "next/router";

import Screen from "../Screen";

import NavButton from "@/components/ui/NavButton";
import VigatecLogo from "@/components/ui/VigatecLogo";

import styles from "./Template.module.scss";

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

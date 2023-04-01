import { useRouter } from "next/router";

import styles from "./SubMenu.module.scss";

interface IOption {
  name: string;
  text: string;
  path: string;
}

interface ISubMenu {
  options: IOption[];
}

interface ISubMenuOption {
  data: IOption;
}

const SubMenu = ({ options }: ISubMenu) => {
  return (
    <div className={styles.subMenu}>
      {options.map((item, idx: number) => (
        <SubMenuOption key={idx} data={item} />
      ))}
    </div>
  );
};

const SubMenuOption = ({ data }: ISubMenuOption) => {
  const router = useRouter();
  return (
    <div
      className={styles.subMenuOption}
      onClick={() => router.push(data.path)}>
      {data.text}
    </div>
  );
};

export default SubMenu;

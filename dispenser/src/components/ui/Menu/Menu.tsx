import { useRouter } from "next/router";

import styles from "./Menu.module.scss";

import { useUI } from "@/store/hooks";

interface IOption {
  name: "cdt" | "lab" | "farmacy";
  text: string;
  icon: string;
  path: string;
}

interface IMenu {
  options: IOption[];
}

interface IMenuOption {
  data: IOption;
}

const Menu = ({ options }: IMenu) => {
  return (
    <div className={styles.menu}>
      {options.map((item, idx: number) => (
        <MenuOption key={idx} data={item} />
      ))}
    </div>
  );
};

const MenuOption = ({ data }: IMenuOption) => {
  const router = useRouter();

  const { setActivity } = useUI();

  const handleClick = (data: IOption) => {
    setActivity(data.name);
    router.push(data.path);
  };

  return (
    <div className={styles.menuOption} onClick={() => handleClick(data)}>
      <div>{data.text}</div>
      <div
        style={{
          backgroundImage: `url(/images/icons/menu/${data.icon})`,
        }}
      ></div>
    </div>
  );
};

export default Menu;

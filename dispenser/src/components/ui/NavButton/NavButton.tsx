import styles from "./NavButton.module.scss";

interface INavButton {
  iconName: string;
}

const NavButton = ({ iconName }: INavButton) => {
  return (
    <div
      className={styles.navButton}
      style={{
        backgroundImage: `url(/images/icons/footer/${iconName}.png)`,
      }}></div>
  );
};

export default NavButton;

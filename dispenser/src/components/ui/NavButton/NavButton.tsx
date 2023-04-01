import styles from "./NavButton.module.scss";

interface INavButton {
  iconName: string;
  onClick?: () => void;
}

const NavButton = ({ iconName, onClick }: INavButton) => {
  return (
    <div
      className={styles.navButton}
      style={{
        backgroundImage: `url(/images/icons/footer/${iconName}.png)`,
      }}
      onClick={onClick}
    ></div>
  );
};

export default NavButton;

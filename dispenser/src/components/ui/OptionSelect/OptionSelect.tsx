import styles from "./OptionSelect.module.scss";

interface IOptionSelect {
    title?: string;
    subTitle?: string;
    icon?: string;
    options: IOption[];
}

interface IOption {
    name: string;
    text: string;
    className?: string;
    path?: string;
    onClick?: any;
}

const OptionSelect = ({ title, subTitle, icon, options }: IOptionSelect) => {
    return (
        <div className={styles.optionSelect}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subTitle && <h2 className={styles.subTitle}>{subTitle}</h2>}
            {icon && (
                <div
                    className={styles.icon}
                    style={{ backgroundImage: `url(${icon})` }}
                ></div>
            )}
            <div className={styles.options}>
                {options.map((item, idx: number) => (
                    <div
                        className={
                            styles.option +
                            `${
                                item.className !== ""
                                    ? " " + styles[item.className]
                                    : ""
                            }`
                        }
                        key={idx}
                        onClick={item.onClick}
                    >
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OptionSelect;

import { uiStore } from "../zustand/uiStore";

const useUI = () => {
  const { footerButtons, activity, option, preferential } = uiStore(
    (state) => ({
      footerButtons: state.footerButtons,
      activity: state.activity,
      option: state.option,
      preferential: state.preferential,
      isLoading: state.isLoading,
      isError: state.isError,
      error: state.error,
    })
  );

  const { setFooterButtons, setActivity, setOption, setPreferential } =
    uiStore();

  return {
    footerButtons,
    setFooterButtons,
    activity,
    setActivity,
    option,
    setOption,
    preferential,
    setPreferential,
  };
};

export default useUI;

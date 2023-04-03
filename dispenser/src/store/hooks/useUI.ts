import { uiStore } from "../zustand/uiStore";

const useUI = () => {
  const { footerButtons, activity } = uiStore((state) => ({
    footerButtons: state.footerButtons,
    activity: state.activity,
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
  }));

  const { setFooterButtons, setActivity } = uiStore();

  return {
    footerButtons,
    setFooterButtons,
    activity,
    setActivity,
  };
};

export default useUI;

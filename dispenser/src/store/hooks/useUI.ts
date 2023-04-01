import { uiStore } from "../zustand/uiStore";

const useUI = () => {
  const { footerButtons } = uiStore((state) => ({
    footerButtons: state.footerButtons,
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
  }));

  const { setFooterButtons } = uiStore();

  return {
    footerButtons,
    setFooterButtons,
  };
};

export default useUI;

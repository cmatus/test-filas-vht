import { labStore } from "../zustand/labStore";

const useLab = () => {
  const { labData, isLoading, isError, error } = labStore((state) => ({
    labData: state.labData,
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
  }));

  const { getLabData } = labStore();

  return {
    labData,
    getLabData,
    isLoading,
    isError,
    error,
  };
};

export default useLab;

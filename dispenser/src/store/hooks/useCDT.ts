import { cdtStore } from "../zustand/cdtStore";

const useCDT = () => {
  const { user, appointment, isLoading, isError, error } = cdtStore(
    (state) => ({
      user: state.user,
      appointment: state.appointment,
      isLoading: state.isLoading,
      isError: state.isError,
      error: state.error,
    })
  );

  const { getData } = cdtStore();

  return {
    user,
    appointment,
    isLoading,
    isError,
    error,
    getData,
  };
};

export default useCDT;

import { pharmacyStore } from "../zustand/pharmacyStore";

const usePharmacy = () => {
  const { user, recipe, isLoading, isError, error } = pharmacyStore(
    (state) => ({
      user: state.user,
      recipe: state.recipe,
      isLoading: state.isLoading,
      isError: state.isError,
      error: state.error,
    })
  );

  const { setUser, addUser, setRecipe, addRecipe } = pharmacyStore();

  return {
    user,
    setUser,
    addUser,
    recipe,
    setRecipe,
    addRecipe,
    isLoading,
    isError,
    error,
  };
};

export default usePharmacy;

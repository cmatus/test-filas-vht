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

  const {
    setUser,
    addUser,
    setRecipe,
    addRecipe,
    getPharmacyData: getData,
  } = pharmacyStore();

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
    getData,
  };
};

export default usePharmacy;

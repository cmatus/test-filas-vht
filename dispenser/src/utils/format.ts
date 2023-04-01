export const unFormatRut = (rut: string) => {
  return rut.split(".").join("").split("-").join("");
};

export const formatRut = (rut: string) => {
  return unFormatRut(rut)
    .replace(/^(\d{1,2})(\d{3})(\d{3})(\w{1})$/, "$1.$2.$3-$4")
    .toUpperCase();
};

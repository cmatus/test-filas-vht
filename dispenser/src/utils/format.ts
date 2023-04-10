export const unFormatRut = (rut: string) => {
  return rut.split(".").join("").split("-").join("");
};

export const formatRut = (rut: string) => {
  return unFormatRut(rut)
    .replace(/^(\d{1,2})(\d{3})(\d{3})(\w{1})$/, "$1.$2.$3-$4")
    .toUpperCase();
};

export const formatRutRequest = (rut: string) => {
  const withoutDots = rut.replace(/\./g, "");
  const hyphenIndex = withoutDots.lastIndexOf("-");
  const formattedWithoutHyphen = withoutDots.slice(0, hyphenIndex);
  const lastDigits = withoutDots.slice(hyphenIndex + 1);
  return `${formattedWithoutHyphen}-${lastDigits}`;
};

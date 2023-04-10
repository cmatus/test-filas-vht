import { rutRegEx } from "./regEx";

export const rutValidate = (rut: string) => {
  let rutNumber = parseInt(rut.substring(0, rut.length - 1));
  const rutDV = rut.substring(rut.length - 1, rut.length);

  let M = 0;
  let S = 1;

  for (; rutNumber; rutNumber = Math.floor(rutNumber / 10))
    S = (S + (rutNumber % 10) * (9 - (M++ % 6))) % 11;

  return (S ? S - 1 : "k").toString().toUpperCase() === rutDV.toUpperCase();
};

export const isValidRut = (rut: string) => {
  return (
    (rutRegEx.test(rut) && rut.length > 7 && rutValidate(rut)) || rut === ""
  );
};

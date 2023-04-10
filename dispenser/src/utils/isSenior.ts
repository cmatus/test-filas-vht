export const isSenior = (data: any) => {
  const age = data?.edad;

  if (age > 60) {
    return true;
  }
  return false;
};

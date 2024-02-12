export const getFormatedNumberWithCommas = (number = 0) => {
  return number.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
};

export const getFormatedNumberWithCommas = (number = 0) => {
  return number.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
};

export const isEmailValid = (email = "") => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

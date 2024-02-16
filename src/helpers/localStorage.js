export const localStorageKeys = {
  authUser: "AUTH_USER_DATA",
};

export const addAuthUserDataToLocalStorage = (id, role) => {
  window.localStorage.setItem(
    localStorageKeys.authUser,
    JSON.stringify({
      id,
      role,
    })
  );
};

export const getAuthUserDataFromLocalStorage = () => {
  const data = window.localStorage.getItem(localStorageKeys.authUser);

  if (data) {
    return JSON.parse(data);
  }

  return undefined;
};

export const removeLocalStorageData = () => {
  window.localStorage.clear();
};

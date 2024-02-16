export const localStorageKeys = {
  authUser: 'AUTH_USER',
};

export const addAuthUserLocalStorage = (id) => {
  window.localStorage.setItem(localStorageKeys.authUser, id);
};

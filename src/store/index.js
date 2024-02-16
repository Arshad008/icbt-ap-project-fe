import React from "react";

export const StoreContext = React.createContext(null);

export const initialStore = {
  isLoading: false,
  authUser: undefined,
};

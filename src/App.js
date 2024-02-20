import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import "./App.css";
import { lightTheme } from "./theme";
import { StoreContext, initialStore } from "./store";
import { AlertProvider } from "./components/alert/AlertProvider";
import { getAuthUserDataFromLocalStorage } from "./helpers/localStorage";
import { Api, apiPaths } from "./api";
// Components
import AppHeader from "./components/AppHeader";
// Pages
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import UserRegistration from "./pages/register/UserRegistration";
import UserProfile from "./pages/user/UserProfile";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffAppointments from "./pages/staff/StaffAppointments";
import StaffCollectSample from "./pages/staff/StaffCollectSample";
import StaffManagement from "./pages/staff/StaffManagement";
import TestManagement from "./pages/staff/TestManagement";

const App = () => {
  const [store, setStore] = useState(initialStore);

  const localAuthData = getAuthUserDataFromLocalStorage();
  const userPermissions =
    store.authUser && store.authUser.role && store.authUser.role === "User";

  const staffPermissions =
    store.authUser && store.authUser.role && store.authUser.role === "Staff";

  useEffect(() => {
    if (
      !store.authUser &&
      localAuthData &&
      localAuthData.id &&
      localAuthData.role
    ) {
      let path = `${apiPaths.user.base}/${localAuthData.id}`;

      if (localAuthData.role === "Staff") {
        path = `${apiPaths.staff.base}/${localAuthData.id}`;
      }

      updateStore({
        isLoading: true,
      });

      Api.get(path)
        .then((res) => {
          updateStore({
            isLoading: false,
            authUser: res.data,
          });
        })
        .catch(() => {
          updateStore({
            isLoading: false,
          });
        });
    }
  }, []);

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  return (
    <AlertProvider>
      <StoreContext.Provider value={{ store, setStore }}>
        <ThemeProvider theme={lightTheme}>
          <AppHeader />
          <div className="App">
            <Routes>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<UserRegistration />} />
              {userPermissions ? (
                <Route path="profile" element={<UserProfile />} />
              ) : null}
              {/* ADMIN */}
              {staffPermissions ? (
                <>
                  <Route path="admin/dashboard" element={<StaffDashboard />} />
                  <Route
                    path="admin/dashboard/staffs"
                    element={<StaffManagement />}
                  />
                  <Route
                    path="admin/dashboard/tests"
                    element={<TestManagement />}
                  />
                  <Route
                    path="admin/dashboard/appointments"
                    element={<StaffAppointments />}
                  />
                  <Route
                    path="admin/dashboard/appointments/view"
                    element={<StaffCollectSample />}
                  />
                </>
              ) : null}
            </Routes>
          </div>
        </ThemeProvider>
      </StoreContext.Provider>
    </AlertProvider>
  );
};

export default App;

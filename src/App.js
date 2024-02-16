import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import "./App.css";
import { lightTheme } from "./theme";
import { StoreContext, initialStore } from "./store";
import { AlertProvider } from "./components/alert/AlertProvider";
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

const App = () => {
  const [store, setStore] = useState(initialStore);

  return (
    <AlertProvider>
      <StoreContext.Provider value={{ store, setStore }}>
        <ThemeProvider theme={lightTheme}>
          <AppHeader />
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<UserRegistration />} />
                <Route path="profile" element={<UserProfile />} />
                {/* ADMIN */}
                <Route path="admin/dashboard" element={<StaffDashboard />} />
                <Route
                  path="admin/dashboard/appointments"
                  element={<StaffAppointments />}
                />
                <Route
                  path="admin/dashboard/collect-sample"
                  element={<StaffCollectSample />}
                />
              </Routes>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </StoreContext.Provider>
    </AlertProvider>
  );
};

export default App;

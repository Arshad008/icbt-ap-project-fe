import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import "./App.css";
import { lightTheme } from "./theme";
// Components
import AppHeader from "./components/AppHeader";
// Pages
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import UserRegistration from "./pages/register/UserRegistration";
import UserProfile from "./pages/user/UserProfile";

const App = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppHeader />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<UserRegistration />} />
            <Route path="profile" element={<UserProfile />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;

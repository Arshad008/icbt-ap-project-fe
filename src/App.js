import React from "react";
import { BrowserRouter, Route, Routes, Na, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/login/Login";

const App = () => {
  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </div>;
};

export default App;

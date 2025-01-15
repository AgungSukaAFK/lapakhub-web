import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import LoadingOverlay from "./components/LoadingOverlay.tsx";
import NotFound from "./pages/NotFound.tsx";
import Provider from "./pages/Provider.tsx";
import Renter from "./pages/Renter.tsx";
import Unitsewa from "./pages/Unitsewa.tsx";
import Akun from "./pages/Akun.tsx";
import Pengajuan from "./pages/Pengajuan.tsx";
import Tagihan from "./pages/Tagihan.tsx";
import ForgotPassword from "./pages/ResetPassword.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingOverlay />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/provider" element={<Provider />} />
        <Route path="/dashboard/renter" element={<Renter />} />
        <Route path="/dashboard/unitsewa" element={<Unitsewa />} />
        <Route path="/dashboard/pengajuan" element={<Pengajuan />} />
        <Route path="/dashboard/tagihan" element={<Tagihan />} />
        <Route path="/dashboard/akun" element={<Akun />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

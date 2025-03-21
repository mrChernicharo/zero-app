import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { useZero as _useZero, ZeroProvider } from "@rocicorp/zero/react";
import { Zero } from "@rocicorp/zero";
import { Schema, schema } from "../schema.ts";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router";

const z = new Zero({
  userID: "test-user",
  schema,
  server: import.meta.env.VITE_PUBLIC_SERVER,
  // auth
  kvStore: "idb",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZeroProvider zero={z}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<App />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ZeroProvider>
  </StrictMode>
);

function RootLayout() {
  return (
    <div>
      <header>
        <Link to="/">HOME</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/login">LOGIN</Link>
      </header>
      <Outlet />
    </div>
  );
}

function About() {
  return <div>about</div>;
}

function Login() {
  return <div>login</div>;
}

export const useZero = _useZero<Schema>;

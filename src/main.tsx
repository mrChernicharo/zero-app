import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { useZero as _useZero, ZeroProvider } from "@rocicorp/zero/react";
import { Zero } from "@rocicorp/zero";
import { Schema, schema } from "../schema.ts";

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
      <App />
    </ZeroProvider>
  </StrictMode>
);

export const useZero = _useZero<Schema>;

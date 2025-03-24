import { FormEvent, StrictMode } from "react";
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

const API_URL = "http://localhost:8900";
export async function postFn(url: string, body: object) {
  try {
    const responseData = await fetch(`${API_URL}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: [["Content-Type", "Application/json"]],
    }).then((res) => res.json());

    return { data: responseData, err: null };
  } catch (error) {
    console.log({ data: null, err: error });
  }
}

function Login() {
  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const email = formData.get("email");
    const password = formData.get("password");

    const data = await postFn("/api/login", { email, password });
    console.log(data);

    console.log({ email, password });
  }

  return (
    <div>
      login
      <form onSubmit={onSubmit}>
        <label htmlFor="email">
          <input placeholder="email" type="email" name="email" id="email" />
        </label>

        <label htmlFor="password">
          <input placeholder="password" type="password" name="password" id="password" />
        </label>

        <button>submit</button>
      </form>
    </div>
  );
}

export const useZero = _useZero<Schema>;

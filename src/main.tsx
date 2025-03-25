import { FormEvent, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { useZero as _useZero, ZeroProvider } from "@rocicorp/zero/react";
import { Zero } from "@rocicorp/zero";
import { Schema, schema, User } from "../schema.ts";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router";
import Cookie from "js-cookie";
import { decodeJwt } from "jose";

const encodedJWT = Cookie.get("jwt");
const decodedJWT = encodedJWT && decodeJwt(encodedJWT);
const userID = decodedJWT?.sub ? (decodedJWT.sub as string) : "unknown";
console.log({ userID });

const z = new Zero({
  userID: "test-user",
  schema,
  server: import.meta.env.VITE_PUBLIC_SERVER,
  auth: () => encodedJWT,
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
export async function postFn<T>(url: string, body: object) {
  try {
    const responseData = await fetch(`${API_URL}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: [["Content-Type", "Application/json"]],
    }).then((res) => {
      res.headers.forEach(console.log);
      return res.json();
    });
    console.log("responseData", responseData);
    return responseData as { data: T[]; err: null };
  } catch (error) {
    return { data: null, err: error };
  }
}

function Login() {
  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const email = formData.get("email");
    const password = formData.get("password");

    const { data } = await postFn<User>("/api/login", { email, password });

    const existingUser = data?.[0] || null;

    console.log(existingUser);

    console.log({ email, password, existingUser, data });
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

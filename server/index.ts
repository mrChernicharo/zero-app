// import { setCookie } from "hono/cookie";
// import { handle } from "hono/vercel";
// import { SignJWT } from "jose";

// export const config = {
//   runtime: "edge",
// };
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import pg from "pg";
import { config } from "dotenv";
config();

const { Client: PGClient } = pg;

const PORT = 8900;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/", (req: Request, res: Response) => {
  //   const jwtPayload = {
  //     sub: userIDs[randomInt(userIDs.length)],
  //     iat: Math.floor(Date.now() / 1000),
  //   };

  //   const jwt = await new SignJWT(jwtPayload)
  //     .setProtectedHeader({ alg: "HS256" })
  //     .setExpirationTime("30days")
  //     .sign(new TextEncoder().encode(must(process.env.ZERO_AUTH_SECRET)));

  //   setCookie(c, "jwt", jwt, {
  //     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  //   });

  console.log("test");

  res.send("test ok!");
});

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

app.post("/api/login", async (req, res) => {
  console.log("** login **", req.body);

  const { data } = await runQuery(`SELECT * FROM "user"`);
  const { rows } = data;

  await wait(1000);

  console.log(rows);
  console.log("ok!");

  res.json({ message: "ok" });
});

app.listen(PORT, () => {
  console.log("listening at", PORT);
});

// function randomInt(max: number) {
//   return Math.floor(Math.random() * max);
// }

// function must<T>(val: T) {
//   if (!val) {
//     throw new Error("Expected value to be defined");
//   }
//   return val;
// }

const db = new PGClient({
  host: process.env.PGHOST_DEV,
  port: Number(process.env.PGPORT_DEV),
  user: process.env.PGUSER_DEV,
  password: process.env.PGPASSWORD_DEV,
  database: process.env.PGDATABASE_DEV,
});

async function runQuery<T>(query: string, args: (string | number)[] = []) {
  await db.connect();
  let data: T | null = null,
    err = null;
  try {
    data = (await db.query(query, [...args])) as T;
  } catch (error) {
    console.error("<runQuery>", error);
    err = error;
  } finally {
    await db.end();
  }

  return { data, err };
}

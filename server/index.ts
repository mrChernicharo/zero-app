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
import { SignJWT } from "jose";
config();

const PORT = 8900;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const { Client: PGClient } = pg;

interface User {
  id: string;
  name: string;
  email: string;
}

const whitelist = ["http://localhost:5176", "http://example2.com"];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

const app = express();
// app.use(cors());
app.use(cors(corsOptionsDelegate));
app.use(express.json());

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

async function dbRun<T>(query: string, args: (string | number)[] = []) {
  const db = new PGClient({
    host: process.env.PGHOST_DEV,
    port: Number(process.env.PGPORT_DEV),
    user: process.env.PGUSER_DEV,
    password: process.env.PGPASSWORD_DEV,
    database: process.env.PGDATABASE_DEV,
  });

  try {
    await db.connect();
    const result = await db.query(query, args);

    const { rows } = result;

    return { data: rows as T[], err: null };
  } catch (error) {
    console.error(`<runQuery ERROR>`, error);

    return { data: null, err: error };
  } finally {
    db.end();
  }
}

app.get("/api/", (req: Request, res: Response) => {
  console.log("test");
  res.send("test ok!");
});

app.post("/api/login", async (req, res) => {
  try {
    console.log("** login **", req.body);

    const { data, err } = await dbRun<User>(`SELECT * FROM "user" WHERE email = $1`, [req.body.email]);

    await wait(100);

    const existingUser = data?.[0] as User;

    console.log("existing user", existingUser);

    const jwtPayload = {
      sub: existingUser.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Date.now() + THIRTY_DAYS,
    };

    const jwt = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30days")
      .sign(new TextEncoder().encode(process.env.ZERO_AUTH_SECRET));

    res.header("Jwt", jwt);

    res.json({ data: jwt, err });
  } catch (err) {
    console.error("/api/login ERROR:", err);
    res.json({ data: null, err });
  }
});

app.listen(PORT, () => {
  console.log("listening at", PORT);
});

// function randomInt(max: number) {
//   return Math.floor(Math.random() * max);
// }

// const db = new PGClient({
//   host: process.env.PGHOST_DEV,
//   port: Number(process.env.PGPORT_DEV),
//   user: process.env.PGUSER_DEV,
//   password: process.env.PGPASSWORD_DEV,
//   database: process.env.PGDATABASE_DEV,
// });

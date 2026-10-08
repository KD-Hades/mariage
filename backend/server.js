import "dotenv/config";
import express from "express";
import pg from "pg";
import { normalizeRsvp } from "./rsvp.js";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

if (!process.env.DATABASE_URL) {
  throw new Error("La variable DATABASE_URL est obligatoire.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use((req, res, next) => {
  const origin = req.get("origin");
  if (!origin) return next();
  if (!allowedOrigins.has(origin)) {
    return res.status(403).json({ error: "Origine non autorisée." });
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "10kb" }));

app.get("/healthz", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ ok: false });
  }
});

app.post("/api/rsvp", async (req, res) => {
  let rsvp;
  try {
    rsvp = normalizeRsvp(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    await pool.query(
      `INSERT INTO rsvps (name, attendance, guest_count, dietary_notes, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [rsvp.name, rsvp.attendance, rsvp.guests, rsvp.diet, rsvp.message]
    );
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Could not save RSVP:", error);
    res.status(500).json({ error: "Impossible d’enregistrer la réponse pour le moment." });
  }
});

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      attendance VARCHAR(20) NOT NULL CHECK (attendance IN ('Présent(e)', 'Absent(e)')),
      guest_count SMALLINT NOT NULL CHECK (guest_count BETWEEN 0 AND 2),
      dietary_notes VARCHAR(1000) NOT NULL DEFAULT '',
      message VARCHAR(2000) NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CHECK (
        (attendance = 'Absent(e)' AND guest_count = 0)
        OR (attendance = 'Présent(e)' AND guest_count BETWEEN 1 AND 2)
      )
    )
  `);

  app.listen(port, () => console.log(`RSVP API listening on port ${port}`));
}

start().catch(async (error) => {
  console.error("Could not start RSVP API:", error);
  await pool.end();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
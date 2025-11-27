import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import pool from "./db/db.config.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test de connexion à Neon
pool.query("SELECT NOW()")
  .then(res => console.log("✨ Connected to Neon:", res.rows[0]))
  .catch(err => console.error("❌ Neon connection error:", err));

// route test
app.get("/", (req, res) => {
  res.send("API Objet Déco en ligne !");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server running: http://localhost:${port}`);
});

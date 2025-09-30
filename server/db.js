// server/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createDb() {
  const db = await open({
    filename: process.env.DB_PATH
      ? process.env.DB_PATH
      : path.join(__dirname, "data.sqlite"),
    driver: sqlite3.Database,
  });
  await db.exec("PRAGMA foreign_keys = ON;");
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      rating REAL,
      description TEXT NOT NULL,
      imageUrl TEXT
    );
  `);
  return db;
}

export async function seed(db) {
  try {
    const raw = await fs.readFile(path.join(__dirname, "db.json"), "utf-8");
    const json = JSON.parse(raw);
    if (!Array.isArray(json.products)) return;

    const { c } = await db.get("SELECT COUNT(*) AS c FROM products");
    if (c > 0) return; // already seeded

    const insert = await db.prepare(
      "INSERT INTO products (id, name, category, price, rating, description, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    try {
      await db.exec("BEGIN");
      for (const p of json.products) {
        await insert.run(
          p.id,
          p.name,
          p.category,
          p.price,
          p.rating ?? null,
          p.description,
          p.imageUrl ?? null
        );
      }
      await db.exec("COMMIT");
      console.log(`Seeded ${json.products.length} products`);
    } catch (e) {
      await db.exec("ROLLBACK");
      throw e;
    } finally {
      await insert.finalize();
    }
  } catch (e) {
    console.warn("Seed skipped:", e.message);
  }
}

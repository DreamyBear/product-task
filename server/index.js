// server/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { z } from "zod";
import { createDb, seed } from "./db.js";

const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());
app.use(morgan("dev"));

const ProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

let db;
(async () => {
  db = await createDb();
  await seed(db);
})();

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/products", async (req, res) => {
  const rows = await db.all("SELECT * FROM products ORDER BY id");
  res.json(rows);
});

app.get("/api/products/:id", async (req, res) => {
  const row = await db.get(
    "SELECT * FROM products WHERE id = ?",
    req.params.id
  );
  if (!row) return res.status(404).json({ message: "Not found" });
  res.json(row);
});

app.post("/api/products", async (req, res) => {
  const parsed = ProductSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ errors: parsed.error.flatten() });

  const {
    name,
    category,
    price,
    rating = null,
    description,
    imageUrl = null,
  } = parsed.data;
  const result = await db.run(
    "INSERT INTO products (name, category, price, rating, description, imageUrl) VALUES (?, ?, ?, ?, ?, ?)",
    name,
    category,
    price,
    rating,
    description,
    imageUrl
  );
  const created = await db.get(
    "SELECT * FROM products WHERE id = ?",
    result.lastID
  );
  res.status(201).json(created);
});

app.put("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const Partial = ProductSchema.partial();
  const parsed = Partial.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ errors: parsed.error.flatten() });

  const existing = await db.get("SELECT * FROM products WHERE id = ?", id);
  if (!existing) return res.status(404).json({ message: "Not found" });

  const next = { ...existing, ...parsed.data };
  await db.run(
    "UPDATE products SET name=?, category=?, price=?, rating=?, description=?, imageUrl=? WHERE id=?",
    next.name,
    next.category,
    next.price,
    next.rating ?? null,
    next.description,
    next.imageUrl ?? null,
    id
  );
  const row = await db.get("SELECT * FROM products WHERE id = ?", id);
  res.json(row);
});

app.delete("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const result = await db.run("DELETE FROM products WHERE id = ?", id);
  if (result.changes === 0)
    return res.status(404).json({ message: "Not found" });
  res.status(204).end();
});

app.get("/healthz", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API running at http://localhost:${port}`));

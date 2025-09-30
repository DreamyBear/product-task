// server/seed.js
import { createDb, seed } from "./db.js";

const db = await createDb();
await seed(db);
await db.close();
console.log("Database seeded.");

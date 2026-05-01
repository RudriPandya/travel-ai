import { Router } from "express";
import { db } from "../db.js";
import { destinationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/destinations/popular", async (req, res) => {
  const destinations = await db.select().from(destinationsTable).where(eq(destinationsTable.isPopular, true));
  res.json(destinations);
});

router.get("/destinations/recommended", async (req, res) => {
  const destinations = await db.select().from(destinationsTable);
  const sorted = destinations.sort((a, b) => parseFloat((b.dealScore ?? "0") as string) - parseFloat((a.dealScore ?? "0") as string));
  res.json(sorted.slice(0, 6));
});

router.get("/destinations/:slug", async (req, res) => {
  const destination = await db.select().from(destinationsTable).where(eq(destinationsTable.slug, req.params.slug)).limit(1);
  if (!destination.length) { res.status(404).json({ error: "Destination not found" }); return; }
  res.json(destination[0]);
});

export default router;

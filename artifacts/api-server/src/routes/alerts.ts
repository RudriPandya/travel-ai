import { Router } from "express";
import { db } from "../db.js";
import { priceAlertsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/alerts", async (req, res) => {
  const userId = 1;
  const alerts = await db.select().from(priceAlertsTable).where(eq(priceAlertsTable.userId, userId));
  res.json(alerts);
});

router.post("/alerts", async (req, res) => {
  const userId = 1;
  const { type, label, currentPrice, targetPrice, currency } = req.body;
  const [alert] = await db.insert(priceAlertsTable).values({
    userId,
    type,
    label,
    currentPrice: currentPrice.toString(),
    targetPrice: targetPrice.toString(),
    currency: currency ?? "USD",
    triggered: false,
    active: true,
  }).returning();
  res.status(201).json(alert);
});

router.delete("/alerts/:id", async (req, res) => {
  await db.delete(priceAlertsTable).where(eq(priceAlertsTable.id, parseInt(req.params.id)));
  res.status(204).send();
});

export default router;

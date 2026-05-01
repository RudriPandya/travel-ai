import { Router } from "express";
import { db } from "../db.js";
import { activityListingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/activities/search", async (req, res) => {
  const { destination, category, date } = req.query;
  let activities = await db.select().from(activityListingsTable);

  if (destination && typeof destination === "string") {
    activities = activities.filter((a) =>
      a.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }
  if (category && typeof category === "string") {
    activities = activities.filter((a) => a.category === category);
  }

  res.json({ activities, total: activities.length });
});

router.get("/activities/recommendations", async (req, res) => {
  const { destination, tripId } = req.query;
  let activities = await db.select().from(activityListingsTable);

  if (destination && typeof destination === "string") {
    activities = activities.filter((a) =>
      a.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  const sorted = activities.sort((a, b) => parseFloat(b.reviewScore as string) - parseFloat(a.reviewScore as string)).slice(0, 8);
  res.json(sorted);
});

export default router;

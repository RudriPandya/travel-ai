import { Router } from "express";
import { db } from "../db.js";
import { activityListingsTable } from "@workspace/db";

const router = Router();

router.get("/activities/search", async (req, res) => {
  const { destination, category } = req.query;
  let activities = await db.select().from(activityListingsTable);

  if (destination && typeof destination === "string") {
    activities = activities.filter((a) =>
      a.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }
  if (category && typeof category === "string") {
    activities = activities.filter((a) => a.category === category);
  }

  res.json(activities.map((a) => ({
    ...a,
    price: parseFloat(a.price as string),
    reviewScore: parseFloat(a.reviewScore as string),
  })));
});

router.get("/activities/recommendations", async (req, res) => {
  const { destination } = req.query;
  let activities = await db.select().from(activityListingsTable);

  if (destination && typeof destination === "string") {
    activities = activities.filter((a) =>
      a.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  const sorted = activities
    .sort((a, b) => parseFloat(b.reviewScore as string) - parseFloat(a.reviewScore as string))
    .slice(0, 8)
    .map((a) => ({
      ...a,
      price: parseFloat(a.price as string),
      reviewScore: parseFloat(a.reviewScore as string),
    }));
  res.json(sorted);
});

export default router;

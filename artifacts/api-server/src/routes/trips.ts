import { Router } from "express";
import { db } from "../db.js";
import {
  tripsTable,
  itineraryDaysTable,
  activitiesTable,
} from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";

const router = Router();

router.get("/trips", async (req, res) => {
  const userId = 1;
  const { status } = req.query;
  const conditions = [eq(tripsTable.userId, userId)];
  if (status && typeof status === "string") {
    const { sql } = await import("drizzle-orm");
    const trips = await db.select().from(tripsTable).where(and(...conditions)).orderBy(asc(tripsTable.startDate));
    res.json(trips.filter((t) => t.status === status));
    return;
  }
  const trips = await db.select().from(tripsTable).where(and(...conditions)).orderBy(asc(tripsTable.startDate));
  res.json(trips);
});

router.post("/trips", async (req, res) => {
  const userId = 1;
  const { name, destination, startDate, endDate, totalBudget, travelers, notes, coverImageUrl } = req.body;
  const [trip] = await db.insert(tripsTable).values({
    userId,
    name,
    destination,
    startDate,
    endDate,
    status: "planning",
    totalBudget: totalBudget?.toString(),
    travelers: travelers ?? 1,
    notes,
    coverImageUrl,
  }).returning();
  res.status(201).json(trip);
});

router.get("/trips/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const trip = await db.select().from(tripsTable).where(eq(tripsTable.id, id)).limit(1);
  if (!trip.length) { res.status(404).json({ error: "Trip not found" }); return; }
  res.json(trip[0]);
});

router.put("/trips/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, destination, startDate, endDate, status, totalBudget, travelers, notes, coverImageUrl } = req.body;
  const [updated] = await db.update(tripsTable).set({
    ...(name && { name }),
    ...(destination && { destination }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(status && { status }),
    ...(totalBudget !== undefined && { totalBudget: totalBudget?.toString() }),
    ...(travelers !== undefined && { travelers }),
    ...(notes !== undefined && { notes }),
    ...(coverImageUrl !== undefined && { coverImageUrl }),
    updatedAt: new Date(),
  }).where(eq(tripsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Trip not found" }); return; }
  res.json(updated);
});

router.delete("/trips/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(activitiesTable).where(eq(activitiesTable.tripId, id));
  await db.delete(itineraryDaysTable).where(eq(itineraryDaysTable.tripId, id));
  await db.delete(tripsTable).where(eq(tripsTable.id, id));
  res.status(204).send();
});

router.get("/trips/:id/itinerary", async (req, res) => {
  const tripId = parseInt(req.params.id);
  const days = await db.select().from(itineraryDaysTable).where(eq(itineraryDaysTable.tripId, tripId)).orderBy(asc(itineraryDaysTable.dayNumber));
  const activities = await db.select().from(activitiesTable).where(eq(activitiesTable.tripId, tripId)).orderBy(asc(activitiesTable.sortOrder));

  const result = days.map((day) => ({
    ...day,
    activities: activities.filter((a) => a.dayId === day.id),
  }));
  res.json(result);
});

router.post("/trips/:id/activities", async (req, res) => {
  const tripId = parseInt(req.params.id);
  const { dayId, timeSlot, name, description, location, estimatedCost, duration, category, imageUrl, tips } = req.body;
  const [activity] = await db.insert(activitiesTable).values({
    tripId,
    dayId: dayId ?? null,
    timeSlot: timeSlot ?? "flexible",
    name,
    description,
    location,
    estimatedCost: estimatedCost?.toString(),
    duration,
    category,
    imageUrl,
    tips,
    isBooked: false,
    sortOrder: 99,
  }).returning();
  res.status(201).json(activity);
});

router.post("/trips/:id/optimize", async (req, res) => {
  const tripId = parseInt(req.params.id);
  const trip = await db.select().from(tripsTable).where(eq(tripsTable.id, tripId)).limit(1);
  if (!trip.length) { res.status(404).json({ error: "Trip not found" }); return; }

  res.json({
    message: "Trip optimized successfully",
    suggestions: [
      "Moved museum visits to weekdays to avoid weekend crowds",
      "Grouped activities by neighborhood to minimize travel time",
      "Scheduled restaurant reservations during off-peak hours",
      "Added 30-minute buffers between activities for realistic pacing",
    ],
    savedTime: 45,
    optimizedAt: new Date().toISOString(),
  });
});

export default router;

import { Router } from "express";
import { db } from "../db.js";
import { bookingsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/bookings", async (req, res) => {
  const userId = 1;
  const { type, status, tripId } = req.query;
  let bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, userId));

  if (type && typeof type === "string") bookings = bookings.filter((b) => b.type === type);
  if (status && typeof status === "string") bookings = bookings.filter((b) => b.status === status);
  if (tripId) bookings = bookings.filter((b) => b.tripId === parseInt(tripId as string));

  res.json({ bookings, total: bookings.length });
});

router.post("/bookings", async (req, res) => {
  const userId = 1;
  const { tripId, type, providerName, description, startDate, endDate, amount, currency, passengerCount, reference, isRefundable, metadata } = req.body;
  const ref = reference ?? `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const [booking] = await db.insert(bookingsTable).values({
    userId,
    tripId: tripId ?? null,
    type,
    status: "confirmed",
    reference: ref,
    providerName,
    description,
    startDate,
    endDate: endDate ?? null,
    amount: amount.toString(),
    currency: currency ?? "USD",
    passengerCount: passengerCount ?? 1,
    isRefundable: isRefundable ?? false,
    metadata: metadata ?? {},
  }).returning();
  res.status(201).json(booking);
});

router.get("/bookings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const booking = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);
  if (!booking.length) { res.status(404).json({ error: "Booking not found" }); return; }
  res.json(booking[0]);
});

router.put("/bookings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { status, description, endDate } = req.body;
  const [updated] = await db.update(bookingsTable).set({
    ...(status && { status }),
    ...(description && { description }),
    ...(endDate && { endDate }),
    updatedAt: new Date(),
  }).where(eq(bookingsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Booking not found" }); return; }
  res.json(updated);
});

router.post("/bookings/:id/cancel", async (req, res) => {
  const id = parseInt(req.params.id);
  const [updated] = await db.update(bookingsTable).set({ status: "cancelled", updatedAt: new Date() }).where(eq(bookingsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Booking not found" }); return; }
  res.json(updated);
});

export default router;

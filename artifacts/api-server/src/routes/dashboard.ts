import { Router } from "express";
import { db } from "../db.js";
import {
  tripsTable,
  bookingsTable,
  expensesTable,
  loyaltyAccountsTable,
  priceAlertsTable,
  notificationsTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (req, res) => {
  const userId = 1;

  const [trips, bookings, expenses, loyalty, alerts, notifications] = await Promise.all([
    db.select().from(tripsTable).where(eq(tripsTable.userId, userId)),
    db.select().from(bookingsTable).where(eq(bookingsTable.userId, userId)),
    db.select().from(expensesTable).where(eq(expensesTable.userId, userId)),
    db.select().from(loyaltyAccountsTable).where(eq(loyaltyAccountsTable.userId, userId)).limit(1),
    db.select().from(priceAlertsTable).where(and(eq(priceAlertsTable.userId, userId), eq(priceAlertsTable.active, true))),
    db.select().from(notificationsTable).where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false))),
  ]);

  const upcomingTrips = trips.filter((t) => t.status === "upcoming" || t.status === "planning");
  const pendingExpenses = expenses.filter((e) => e.status === "pending");
  const totalSpend = bookings.reduce((acc, b) => acc + parseFloat(b.amount as string), 0);

  res.json({
    totalTrips: trips.length,
    upcomingTrips: upcomingTrips.length,
    loyaltyPoints: loyalty[0]?.points ?? 0,
    loyaltyTier: loyalty[0]?.tier ?? "explorer",
    pendingExpenses: pendingExpenses.length,
    pendingExpensesAmount: pendingExpenses.reduce((acc, e) => acc + parseFloat(e.amount as string), 0),
    priceAlerts: alerts.length,
    unreadNotifications: notifications.length,
    totalSpend,
    savedOnDeals: 842,
    carbonOffset: 12.4,
  });
});

router.get("/dashboard/upcoming-trips", async (req, res) => {
  const userId = 1;
  const trips = await db
    .select()
    .from(tripsTable)
    .where(and(eq(tripsTable.userId, userId)))
    .orderBy(tripsTable.startDate)
    .limit(5);

  const upcoming = trips.filter((t) => t.status === "upcoming" || t.status === "planning");
  res.json(upcoming);
});

router.get("/dashboard/price-alerts", async (req, res) => {
  const userId = 1;
  const alerts = await db
    .select()
    .from(priceAlertsTable)
    .where(and(eq(priceAlertsTable.userId, userId), eq(priceAlertsTable.active, true)))
    .limit(5);
  res.json(alerts);
});

export default router;

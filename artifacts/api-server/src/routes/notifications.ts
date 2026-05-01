import { Router } from "express";
import { db } from "../db.js";
import { notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/notifications", async (req, res) => {
  const userId = 1;
  const { unread } = req.query;
  let notifications = await db.select().from(notificationsTable)
    .where(eq(notificationsTable.userId, userId))
    .orderBy(desc(notificationsTable.createdAt));
  if (unread === "true") notifications = notifications.filter((n) => !n.isRead);
  res.json({ notifications, total: notifications.length, unread: notifications.filter((n) => !n.isRead).length });
});

router.post("/notifications/:id/read", async (req, res) => {
  const id = parseInt(req.params.id);
  const [updated] = await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Notification not found" }); return; }
  res.json(updated);
});

router.post("/notifications/read-all", async (req, res) => {
  const userId = 1;
  await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.userId, userId));
  res.json({ message: "All notifications marked as read" });
});

export default router;

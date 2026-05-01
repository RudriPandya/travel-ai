import { Router } from "express";
import { db } from "../db.js";
import { usersTable, travelDocumentsTable, savedLoyaltyProgramsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/profile", async (req, res) => {
  const userId = 1;
  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user.length) { res.status(404).json({ error: "Profile not found" }); return; }
  res.json(user[0]);
});

router.put("/profile", async (req, res) => {
  const userId = 1;
  const { firstName, lastName, email, nationality, dateOfBirth, phoneNumber, preferredCurrency, preferredLanguage, seatPreference, mealPreference, notificationsEnabled } = req.body;
  const [updated] = await db.update(usersTable).set({
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(email && { email }),
    ...(nationality !== undefined && { nationality }),
    ...(dateOfBirth !== undefined && { dateOfBirth }),
    ...(phoneNumber !== undefined && { phoneNumber }),
    ...(preferredCurrency && { preferredCurrency }),
    ...(preferredLanguage && { preferredLanguage }),
    ...(seatPreference !== undefined && { seatPreference }),
    ...(mealPreference !== undefined && { mealPreference }),
    ...(notificationsEnabled !== undefined && { notificationsEnabled }),
    updatedAt: new Date(),
  }).where(eq(usersTable.id, userId)).returning();
  res.json(updated);
});

router.get("/profile/documents", async (req, res) => {
  const userId = 1;
  const documents = await db.select().from(travelDocumentsTable).where(eq(travelDocumentsTable.userId, userId));
  res.json(documents);
});

router.post("/profile/documents", async (req, res) => {
  const userId = 1;
  const { type, name, number, issuingCountry, expiryDate } = req.body;
  const [doc] = await db.insert(travelDocumentsTable).values({
    userId,
    type,
    name,
    number: number ?? null,
    issuingCountry: issuingCountry ?? null,
    expiryDate: expiryDate ?? null,
  }).returning();
  res.status(201).json(doc);
});

export default router;

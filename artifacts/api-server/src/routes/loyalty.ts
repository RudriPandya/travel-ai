import { Router } from "express";
import { db } from "../db.js";
import {
  loyaltyAccountsTable,
  loyaltyTransactionsTable,
  rewardsTable,
  savedLoyaltyProgramsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const TIER_THRESHOLDS: Record<string, { minPoints: number; maxPoints: number; earnRate: number; benefits: string[] }> = {
  explorer: {
    minPoints: 0,
    maxPoints: 25000,
    earnRate: 1.0,
    benefits: ["Standard check-in", "Basic customer support", "Access to price alerts"],
  },
  voyager: {
    minPoints: 25000,
    maxPoints: 75000,
    earnRate: 1.5,
    benefits: ["Priority check-in", "1 free checked bag", "Dedicated support line", "Lounge access (2x/year)", "25% bonus points"],
  },
  elite: {
    minPoints: 75000,
    maxPoints: 150000,
    earnRate: 2.0,
    benefits: ["Priority boarding", "2 free checked bags", "Lounge access (unlimited)", "Seat upgrades (50% off)", "50% bonus points", "Concierge service"],
  },
  legend: {
    minPoints: 150000,
    maxPoints: 999999,
    earnRate: 3.0,
    benefits: ["Complimentary upgrades when available", "Private airport transfer", "Unlimited lounge access + guest", "100% bonus points", "Personal travel manager", "Hotel room upgrades"],
  },
};

const router = Router();

router.get("/loyalty/account", async (req, res) => {
  const userId = 1;
  const account = await db.select().from(loyaltyAccountsTable).where(eq(loyaltyAccountsTable.userId, userId)).limit(1);
  if (!account.length) { res.status(404).json({ error: "Loyalty account not found" }); return; }

  const acc = account[0];
  const tier = TIER_THRESHOLDS[acc.tier] ?? TIER_THRESHOLDS.explorer;
  const tierName = acc.tier.charAt(0).toUpperCase() + acc.tier.slice(1);

  res.json({
    ...acc,
    tierName,
    earnRate: tier.earnRate,
    benefits: tier.benefits,
    pointsToNextTier: Math.max(0, tier.maxPoints - acc.points),
    nextTier: acc.tier === "legend" ? null : Object.keys(TIER_THRESHOLDS)[Object.keys(TIER_THRESHOLDS).indexOf(acc.tier) + 1],
    tierProgress: Math.min(100, ((acc.points - tier.minPoints) / (tier.maxPoints - tier.minPoints)) * 100),
  });
});

router.get("/loyalty/transactions", async (req, res) => {
  const userId = 1;
  const transactions = await db.select().from(loyaltyTransactionsTable).where(eq(loyaltyTransactionsTable.userId, userId));
  res.json(transactions);
});

router.get("/loyalty/rewards", async (req, res) => {
  const rewards = await db.select().from(rewardsTable).where(eq(rewardsTable.available, true));
  res.json(rewards);
});

router.get("/loyalty/programs", async (req, res) => {
  const userId = 1;
  const programs = await db.select().from(savedLoyaltyProgramsTable).where(eq(savedLoyaltyProgramsTable.userId, userId));
  res.json(programs);
});

router.post("/loyalty/programs", async (req, res) => {
  const userId = 1;
  const { programName, carrier, membershipNumber, tier, points, expiryDate } = req.body;
  const [program] = await db.insert(savedLoyaltyProgramsTable).values({
    userId,
    programName,
    carrier,
    membershipNumber,
    tier: tier ?? null,
    points: points ?? null,
    expiryDate: expiryDate ?? null,
  }).returning();
  res.status(201).json(program);
});

export default router;

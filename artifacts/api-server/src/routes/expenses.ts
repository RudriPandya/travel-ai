import { Router } from "express";
import { db } from "../db.js";
import { expensesTable, expenseReportsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/expenses", async (req, res) => {
  const userId = 1;
  const { tripId, status, category } = req.query;
  let expenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, userId));
  if (tripId) expenses = expenses.filter((e) => e.tripId === parseInt(tripId as string));
  if (status && typeof status === "string") expenses = expenses.filter((e) => e.status === status);
  if (category && typeof category === "string") expenses = expenses.filter((e) => e.category === category);
  res.json(expenses);
});

router.post("/expenses", async (req, res) => {
  const userId = 1;
  const { tripId, category, description, amount, currency, date, merchant, notes } = req.body;
  const [expense] = await db.insert(expensesTable).values({
    userId,
    tripId: tripId ?? null,
    category,
    description,
    amount: amount.toString(),
    currency: currency ?? "USD",
    amountUsd: amount.toString(),
    date,
    merchant: merchant ?? null,
    notes: notes ?? null,
    status: "pending",
  }).returning();
  res.status(201).json(expense);
});

router.put("/expenses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { category, description, amount, merchant, status, notes } = req.body;
  const [updated] = await db.update(expensesTable).set({
    ...(category && { category }),
    ...(description && { description }),
    ...(amount !== undefined && { amount: amount.toString(), amountUsd: amount.toString() }),
    ...(merchant !== undefined && { merchant }),
    ...(status && { status }),
    ...(notes !== undefined && { notes }),
    updatedAt: new Date(),
  }).where(eq(expensesTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Expense not found" }); return; }
  res.json(updated);
});

router.delete("/expenses/:id", async (req, res) => {
  await db.delete(expensesTable).where(eq(expensesTable.id, parseInt(req.params.id)));
  res.status(204).send();
});

router.get("/expenses/reports", async (req, res) => {
  const userId = 1;
  const reports = await db.select().from(expenseReportsTable).where(eq(expenseReportsTable.userId, userId));
  res.json({ reports, total: reports.length });
});

router.post("/expenses/reports", async (req, res) => {
  const userId = 1;
  const { title, tripId } = req.body;
  const expenses = await db.select().from(expensesTable).where(and(eq(expensesTable.userId, userId), eq(expensesTable.status, "pending")));
  const total = expenses.reduce((acc, e) => acc + parseFloat(e.amount as string), 0);
  const [report] = await db.insert(expenseReportsTable).values({
    userId,
    tripId: tripId ?? null,
    title: title ?? `Expense Report — ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    status: "draft",
    totalAmount: total.toString(),
    currency: "USD",
    expenseCount: expenses.length,
  }).returning();
  res.status(201).json(report);
});

router.get("/expenses/summary", async (req, res) => {
  const userId = 1;
  const { tripId } = req.query;
  let expenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, userId));
  if (tripId) expenses = expenses.filter((e) => e.tripId === parseInt(tripId as string));

  const byCategoryMap: Record<string, number> = {};
  let total = 0;
  for (const e of expenses) {
    const amt = parseFloat(e.amount as string);
    byCategoryMap[e.category] = (byCategoryMap[e.category] ?? 0) + amt;
    total += amt;
  }

  const byCategory = Object.entries(byCategoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? parseFloat(((amount / total) * 100).toFixed(1)) : 0,
    count: expenses.filter((e) => e.category === category).length,
  })).sort((a, b) => b.amount - a.amount);

  res.json({
    totalAmount: total,
    currency: "USD",
    byCategory,
    byDay: [],
    budgetUsed: null,
    budgetRemaining: null,
  });
});

export default router;

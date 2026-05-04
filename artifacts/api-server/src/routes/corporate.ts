import { Router } from "express";
import { db } from "../db.js";
import { corporateTravelersTable, approvalsTable, travelPoliciesTable, bookingsTable, expensesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/corporate/overview", async (req, res) => {
  const travelers = await db.select().from(corporateTravelersTable);
  const approvals = await db.select().from(approvalsTable);
  const bookings = await db.select().from(bookingsTable);
  const expenses = await db.select().from(expensesTable);

  const totalSpend = travelers.reduce((acc, t) => acc + parseFloat(t.totalSpend as string), 0);
  const totalBudget = 95000;
  const pendingApprovals = approvals.filter((a) => a.status === "pending").length;
  const avgCompliance = travelers.length > 0
    ? travelers.reduce((acc, t) => acc + parseFloat(t.complianceRate as string), 0) / travelers.length
    : 100;

  const spendByMonth = [
    { month: "Oct", amount: 8240 },
    { month: "Nov", amount: 11200 },
    { month: "Dec", amount: 6800 },
    { month: "Jan", amount: 9100 },
    { month: "Feb", amount: 12340 },
    { month: "Mar", amount: 15200 },
  ];

  const departments: Record<string, number> = {};
  for (const t of travelers) {
    departments[t.department] = (departments[t.department] ?? 0) + parseFloat(t.totalSpend as string);
  }
  const spendByDepartment = Object.entries(departments).map(([department, amount]) => ({ department, amount }));

  res.json({
    totalSpend,
    totalBudget,
    budgetUtilization: ((totalSpend / totalBudget) * 100).toFixed(1),
    pendingApprovals,
    policyCompliance: avgCompliance.toFixed(1),
    activeTravelers: travelers.filter((t) => t.status === "traveling").length,
    totalTravelers: travelers.length,
    savedVsLastQuarter: 2840,
    spendByMonth,
    spendByDepartment,
  });
});

router.get("/corporate/travelers", async (req, res) => {
  const travelers = await db.select().from(corporateTravelersTable);
  res.json(travelers);
});

router.get("/corporate/approvals", async (req, res) => {
  const { status } = req.query;
  let approvals = await db.select().from(approvalsTable);
  if (status && typeof status === "string") approvals = approvals.filter((a) => a.status === status);
  res.json(approvals);
});

router.post("/corporate/approvals/:id/approve", async (req, res) => {
  const id = parseInt(req.params.id);
  const [updated] = await db.update(approvalsTable).set({
    status: "approved",
    reviewedAt: new Date().toISOString().split("T")[0],
  }).where(eq(approvalsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Approval not found" }); return; }
  res.json(updated);
});

router.post("/corporate/approvals/:id/reject", async (req, res) => {
  const id = parseInt(req.params.id);
  const { reason } = req.body;
  const [updated] = await db.update(approvalsTable).set({
    status: "rejected",
    reason: reason ?? "Does not meet policy requirements",
    reviewedAt: new Date().toISOString().split("T")[0],
  }).where(eq(approvalsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Approval not found" }); return; }
  res.json(updated);
});

router.get("/corporate/policy", async (req, res) => {
  const policy = await db.select().from(travelPoliciesTable).where(eq(travelPoliciesTable.companyId, 1)).limit(1);
  if (!policy.length) { res.status(404).json({ error: "Policy not found" }); return; }
  res.json(policy[0]);
});

router.put("/corporate/policy", async (req, res) => {
  const { maxHotelRatePerNight, maxFlightClassShortHaul, maxFlightClassLongHaul, advanceBookingDays, requiresApprovalAbove, perDiemRate, preferredAirlines, preferredHotelChains } = req.body;
  const [updated] = await db.update(travelPoliciesTable).set({
    ...(maxHotelRatePerNight !== undefined && { maxHotelRatePerNight: maxHotelRatePerNight.toString() }),
    ...(maxFlightClassShortHaul && { maxFlightClassShortHaul }),
    ...(maxFlightClassLongHaul && { maxFlightClassLongHaul }),
    ...(advanceBookingDays !== undefined && { advanceBookingDays }),
    ...(requiresApprovalAbove !== undefined && { requiresApprovalAbove: requiresApprovalAbove.toString() }),
    ...(perDiemRate !== undefined && { perDiemRate: perDiemRate.toString() }),
    ...(preferredAirlines && { preferredAirlines }),
    ...(preferredHotelChains && { preferredHotelChains }),
    updatedAt: new Date(),
  }).where(eq(travelPoliciesTable.companyId, 1)).returning();
  res.json(updated);
});

router.get("/corporate/spend-report", async (req, res) => {
  const { period } = req.query;
  res.json({
    period: period ?? "quarterly",
    totalSpend: 63080,
    budget: 95000,
    savings: 2840,
    policyViolations: 3,
    topSpenders: [
      { name: "Marcus Williams", department: "Sales", amount: 23100 },
      { name: "Alex Morgan", department: "Executive", amount: 18420 },
      { name: "Sarah Chen", department: "Engineering", amount: 12340 },
    ],
    categoryBreakdown: [
      { category: "Flights", amount: 28400 },
      { category: "Hotels", amount: 21200 },
      { category: "Meals", amount: 8340 },
      { category: "Transport", amount: 3200 },
      { category: "Other", amount: 1940 },
    ],
  });
});

export default router;

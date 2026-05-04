import React, { useState } from "react";
import { useListExpenses, useGetExpenseSummary, useCreateExpense } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Receipt, Coffee, Car, Plane, Home, CreditCard, X, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const CATEGORIES = ["flights", "accommodation", "transport", "meals", "entertainment", "other"];

function getCategoryIcon(cat: string) {
  switch (cat) {
    case "flights": return <Plane className="h-4 w-4" />;
    case "accommodation": return <Home className="h-4 w-4" />;
    case "transport": return <Car className="h-4 w-4" />;
    case "meals": return <Coffee className="h-4 w-4" />;
    default: return <CreditCard className="h-4 w-4" />;
  }
}

export default function Expenses() {
  const { data: expenses, isLoading: loadingExpenses } = useListExpenses({});
  const { data: summary, isLoading: loadingSummary } = useGetExpenseSummary({});
  const createExpense = useCreateExpense();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "meals",
    merchant: "",
    date: new Date().toISOString().split("T")[0],
    currency: "USD",
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;
    createExpense.mutate(
      {
        data: {
          description: form.description,
          amount: parseFloat(form.amount),
          category: form.category,
          merchant: form.merchant || undefined,
          date: form.date,
          currency: form.currency,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["listExpenses"] });
          queryClient.invalidateQueries({ queryKey: ["getExpenseSummary"] });
          setShowModal(false);
          setForm({ description: "", amount: "", category: "meals", merchant: "", date: new Date().toISOString().split("T")[0], currency: "USD" });
          toast({ title: "Expense added", description: "Your expense has been recorded successfully." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add expense. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track and submit your corporate expenses.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-card-border col-span-1 md:col-span-2">
          <CardContent className="p-6 h-full flex flex-col justify-center">
            <div className="flex items-center gap-4 text-muted-foreground mb-4 uppercase tracking-wider text-xs font-semibold">
              <Receipt className="h-4 w-4 text-primary" /> Total Expenses
            </div>
            {loadingSummary ? (
              <Skeleton className="h-16 w-48" />
            ) : (
              <div>
                <div className="text-5xl font-bold font-mono tracking-tight">
                  ${typeof summary?.totalAmount === "number" ? summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {summary?.budgetRemaining !== null && summary?.budgetRemaining !== undefined ? (
                    <span className="text-emerald-500 font-medium">${summary.budgetRemaining} remaining in budget</span>
                  ) : "All time spend"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Spend by Category</h3>
            <div className="h-40 w-full relative">
              {loadingSummary ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : summary?.byCategory && summary.byCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={summary.byCategory} innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="amount" nameKey="category" stroke="none">
                      {summary.byCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [`$${value}`, "Amount"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-card-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-xs font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Merchant / Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingExpenses ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td className="px-6 py-4" colSpan={5}><Skeleton className="h-10 w-full" /></td>
                    </tr>
                  ))
                ) : expenses && expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{expense.merchant || "Unknown Merchant"}</div>
                        <div className="text-xs text-muted-foreground max-w-[200px] truncate">{expense.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs capitalize">
                          {getCategoryIcon(expense.category)} {expense.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-mono font-medium">${expense.amount}</div>
                        <div className="text-xs text-muted-foreground uppercase">{expense.currency}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider
                          ${expense.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                            expense.status === "pending" ? "bg-accent/10 text-accent" :
                            expense.status === "rejected" ? "bg-destructive/10 text-destructive" :
                            "bg-muted text-muted-foreground"}`}>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No expenses recorded yet. Click "Add Expense" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" /> New Expense
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount *</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description *</label>
                <Input
                  placeholder="e.g. Client dinner, Taxi to airport..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Merchant</label>
                <Input
                  placeholder="e.g. Marriott, United Airlines..."
                  value={form.merchant}
                  onChange={(e) => set("merchant", e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => set("currency", e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <Button variant="outline" className="flex-1 border-border" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={!form.description || !form.amount || createExpense.isPending}
              >
                {createExpense.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                ) : (
                  "Add Expense"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

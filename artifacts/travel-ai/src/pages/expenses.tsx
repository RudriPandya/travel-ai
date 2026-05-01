import React from "react";
import { useListExpenses, useGetExpenseSummary } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, Coffee, Car, Plane, Home, CreditCard } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Expenses() {
  const { data: expenses, isLoading: loadingExpenses } = useListExpenses();
  const { data: summary, isLoading: loadingSummary } = useGetExpenseSummary();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'flights': return <Plane className="h-4 w-4" />;
      case 'accommodation': return <Home className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'meals': return <Coffee className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track and submit your corporate expenses.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
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
                <div className="text-5xl font-bold font-mono tracking-tight">${summary?.totalAmount || 0}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {summary?.budgetRemaining !== null && summary?.budgetRemaining !== undefined ? (
                    <span className="text-emerald-500 font-medium">${summary.budgetRemaining} remaining in budget</span>
                  ) : 'All time spend'}
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
                    <Pie
                      data={summary.byCategory}
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="category"
                      stroke="none"
                    >
                      {summary.byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`$${value}`, 'Amount']}
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
                  [1,2,3,4,5].map(i => (
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
                        <div className="font-semibold text-foreground">{expense.merchant || 'Unknown Merchant'}</div>
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
                          ${expense.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                            expense.status === 'pending' ? 'bg-accent/10 text-accent' : 
                            expense.status === 'rejected' ? 'bg-destructive/10 text-destructive' : 
                            'bg-muted text-muted-foreground'}
                        `}>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

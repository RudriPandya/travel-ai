import React from "react";
import { useGetCorporateOverview } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, AlertTriangle, Users, TrendingUp, TrendingDown, DollarSign, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function CorporateDashboard() {
  const { data: overview, isLoading } = useGetCorporateOverview();

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-12 w-48" /><Skeleton className="h-40 w-full" /></div>;
  }

  const complianceRate = overview?.policyCompliance || 0;
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Corporate Overview</h1>
        <p className="text-muted-foreground mt-1">High-level insights into your company's travel program.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider">Total Spend YTD</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight">${overview?.totalSpend.toLocaleString() || 0}</div>
            <div className="text-xs mt-2 text-muted-foreground">
               of ${overview?.totalBudget.toLocaleString() || 0} budget
            </div>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
               <div 
                 className={`h-full ${((overview?.totalSpend || 0)/(overview?.totalBudget || 1)) > 0.9 ? 'bg-destructive' : 'bg-primary'}`} 
                 style={{ width: `${Math.min(100, ((overview?.totalSpend || 0)/(overview?.totalBudget || 1))*100)}%` }}
               />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider">Policy Compliance</span>
              <CheckCircle className={`h-4 w-4 ${complianceRate >= 90 ? 'text-emerald-500' : 'text-accent'}`} />
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight">{complianceRate}%</div>
            <div className="text-xs mt-2 text-muted-foreground flex items-center gap-1">
              {complianceRate >= 90 ? (
                <><TrendingUp className="h-3 w-3 text-emerald-500" /> Excellent compliance</>
              ) : (
                <><TrendingDown className="h-3 w-3 text-destructive" /> Needs improvement</>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider">Pending Approvals</span>
              <AlertTriangle className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-bold tracking-tight">{overview?.pendingApprovals || 0}</div>
            <div className="text-xs mt-2 text-accent font-medium hover:underline cursor-pointer">
              Review requests →
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
             <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider">Active Travelers</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold tracking-tight">42</div>
            <div className="text-xs mt-2 text-muted-foreground">Currently on the road</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-6">Spend by Month</h3>
            <div className="h-72 w-full">
              {overview?.spendByMonth ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overview.spendByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-6">Spend by Department</h3>
            <div className="h-72 w-full">
              {overview?.spendByDepartment ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview.spendByDepartment} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <YAxis dataKey="department" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      cursor={{ fill: 'hsl(var(--muted))' }}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

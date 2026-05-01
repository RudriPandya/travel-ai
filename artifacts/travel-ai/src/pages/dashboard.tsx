import React from "react";
import { useGetDashboardStats, useGetUpcomingTrips, useGetPriceAlerts } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, CreditCard, Award, Bell, Activity, DollarSign, Leaf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: stats, isLoading: loadingStats } = useGetDashboardStats();
  const { data: upcomingTrips, isLoading: loadingTrips } = useGetUpcomingTrips();
  const { data: priceAlerts, isLoading: loadingAlerts } = useGetPriceAlerts();

  if (loadingStats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back. Here's your travel summary.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/plan">Plan New Trip</Link>
          </Button>
          <Button asChild variant="outline" className="border-border">
            <Link href="/expenses">Add Expense</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-card-border hover-elevate transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium uppercase tracking-wider">Total Trips</span>
              <Plane className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">{stats?.totalTrips || 0}</div>
            <div className="text-xs text-muted-foreground">{stats?.upcomingTrips || 0} upcoming</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-card-border hover-elevate transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium uppercase tracking-wider">Loyalty Points</span>
              <Award className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-bold text-accent">{stats?.loyaltyPoints?.toLocaleString() || 0}</div>
            <div className="text-xs text-muted-foreground">Tier: <span className="font-semibold text-accent">{stats?.loyaltyTier || 'Member'}</span></div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border hover-elevate transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium uppercase tracking-wider">YTD Spend</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold">${stats?.totalSpent?.toLocaleString() || 0}</div>
            <div className="text-xs text-muted-foreground">{stats?.pendingExpenses || 0} pending expenses</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border hover-elevate transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium uppercase tracking-wider">Carbon Offset</span>
              <Leaf className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold">{stats?.carbonOffset || 0} <span className="text-lg text-muted-foreground">kg</span></div>
            <div className="text-xs text-muted-foreground">Saved ${stats?.savedOnBookings || 0} on deals</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-border pb-2">Upcoming Trips</h2>
          <div className="grid gap-4">
            {loadingTrips ? (
               <Skeleton className="h-32 w-full rounded-xl" />
            ) : upcomingTrips && upcomingTrips.length > 0 ? (
              upcomingTrips.map((trip) => (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="bg-card border-card-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group">
                    <div className="flex items-center h-32">
                      <div className="w-32 h-full bg-muted flex-shrink-0 relative overflow-hidden">
                        {trip.coverImageUrl ? (
                          <img src={trip.coverImageUrl} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                            <Map className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 flex-1 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{trip.destination}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                            {trip.status}
                          </div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className="text-sm text-muted-foreground mb-1">In {trip.daysUntil} days</div>
                          <div className="font-semibold">{trip.travelers} Traveler(s)</div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center p-8 border border-dashed border-border rounded-xl bg-card">
                <Plane className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg">No upcoming trips</h3>
                <p className="text-muted-foreground text-sm mb-4">Time to plan your next adventure.</p>
                <Button asChild variant="outline">
                  <Link href="/plan">Plan a Trip</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-border pb-2">Active Alerts</h2>
          <Card className="bg-card border-card-border">
            <CardContent className="p-0">
              {loadingAlerts ? (
                <div className="p-6"><Skeleton className="h-20 w-full" /></div>
              ) : priceAlerts && priceAlerts.length > 0 ? (
                <div className="divide-y divide-border">
                  {priceAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${alert.triggered ? 'bg-green-500' : 'bg-accent'}`} />
                        <div>
                          <p className="font-medium text-sm">{alert.label}</p>
                          <p className="text-xs text-muted-foreground">Target: ${alert.targetPrice}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${alert.currentPrice}</p>
                        {alert.priceChangePercent !== null && (
                          <p className={`text-xs ${alert.priceChangePercent < 0 ? 'text-green-500' : 'text-destructive'}`}>
                            {alert.priceChangePercent > 0 ? '+' : ''}{alert.priceChangePercent}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No active price alerts.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

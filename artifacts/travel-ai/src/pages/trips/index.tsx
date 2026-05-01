import React from "react";
import { useListTrips } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Map, Plane, Calendar, Users, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function TripsList() {
  const { data: trips, isLoading } = useListTrips();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-500';
      case 'upcoming': return 'bg-primary/20 text-primary';
      case 'planning': return 'bg-accent/20 text-accent';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-1">Manage your corporate and personal travel.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/plan">Plan New Trip</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
        ) : trips && trips.length > 0 ? (
          trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <Card className="bg-card border-card-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group">
                <div className="flex flex-col md:flex-row h-full md:h-48">
                  <div className="w-full md:w-64 h-48 md:h-full bg-muted flex-shrink-0 relative overflow-hidden">
                    {trip.coverImageUrl ? (
                      <img src={trip.coverImageUrl} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        <Map className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{trip.name}</h2>
                        <div className="flex items-center text-muted-foreground gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1.5"><Plane className="h-4 w-4" /> {trip.destination}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {trip.travelers} Travelers</span>
                        </div>
                      </div>
                      <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all hidden md:block" />
                    </div>

                    {trip.totalBudget && trip.totalSpent !== null && (
                      <div className="mt-6 md:mt-0">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="font-medium font-mono">${trip.totalSpent} / ${trip.totalBudget}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${trip.totalSpent > trip.totalBudget ? 'bg-destructive' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(100, (trip.totalSpent / trip.totalBudget) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
            <h3 className="text-xl font-medium">No trips found</h3>
            <p className="text-muted-foreground mt-2">You don't have any trips yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

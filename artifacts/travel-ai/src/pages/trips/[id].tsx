import React from "react";
import { useGetTrip, useGetItineraryDays, useOptimizeTrip } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Clock, Plane, Map, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TripDetail({ id }: { id: number }) {
  const { data: trip, isLoading: loadingTrip } = useGetTrip(id, { query: { enabled: !!id, queryKey: ['trip', id] } });
  const optimizeTrip = useOptimizeTrip();

  if (loadingTrip) {
    return <div className="space-y-8"><Skeleton className="h-64 w-full rounded-xl" /><Skeleton className="h-96 w-full rounded-xl" /></div>;
  }

  if (!trip) return <div>Trip not found</div>;

  const handleOptimize = () => {
    optimizeTrip.mutate({ data: { optimizationType: 'route' } });
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-border group">
        {trip.coverImageUrl ? (
           <img src={trip.coverImageUrl} alt={trip.destination} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sidebar to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent flex flex-col justify-end p-8">
          <div className="flex justify-between items-end">
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground mb-3">
                {trip.status}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">{trip.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/80">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {trip.destination}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            <Button onClick={handleOptimize} className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground" disabled={optimizeTrip.isPending}>
              {optimizeTrip.isPending ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Optimize Route
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-2">Itinerary</h2>
          
          {trip.itineraryDays && trip.itineraryDays.length > 0 ? (
            <div className="space-y-8">
               {trip.itineraryDays.map((day) => (
                <div key={day.id} className="relative pl-8 md:pl-0">
                  <div className="absolute left-[11px] md:hidden top-0 bottom-0 w-px bg-border/50"></div>
                  
                  <div className="md:flex gap-6">
                    <div className="md:w-24 flex-shrink-0 relative mb-4 md:mb-0 text-left md:text-right pt-2">
                      <div className="absolute left-[-33px] md:hidden top-3 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>
                      <div className="font-bold text-lg">Day {day.dayNumber}</div>
                      <div className="text-xs text-muted-foreground uppercase">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    </div>
                    
                    <Card className="flex-1 bg-card border-card-border">
                      <CardContent className="p-0">
                        <div className="bg-muted px-4 py-3 border-b border-border font-semibold">
                          {day.title || `Exploring ${trip.destination}`}
                        </div>
                        <div className="divide-y divide-border">
                          {day.activities && day.activities.length > 0 ? day.activities.map((act) => (
                            <div key={act.id} className="p-4 hover:bg-muted/30 transition-colors flex gap-4">
                              <div className="w-16 flex-shrink-0 text-xs font-medium text-muted-foreground pt-0.5 capitalize flex flex-col items-center">
                                {act.timeSlot === 'morning' && <div className="h-2 w-2 rounded-full bg-amber-400 mb-1"></div>}
                                {act.timeSlot === 'afternoon' && <div className="h-2 w-2 rounded-full bg-orange-500 mb-1"></div>}
                                {act.timeSlot === 'evening' && <div className="h-2 w-2 rounded-full bg-indigo-400 mb-1"></div>}
                                {act.timeSlot}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold text-base">{act.name}</h4>
                                  {act.estimatedCost ? <span className="font-mono text-sm">${act.estimatedCost}</span> : null}
                                </div>
                                {act.description && <p className="text-sm text-muted-foreground mt-1 mb-2">{act.description}</p>}
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  {act.location && <span className="inline-flex items-center gap-1 bg-background border border-border px-2 py-0.5 rounded"><MapPin className="h-3 w-3" /> {act.location}</span>}
                                  {act.duration && <span className="inline-flex items-center gap-1 bg-background border border-border px-2 py-0.5 rounded"><Clock className="h-3 w-3" /> ~{act.duration}h</span>}
                                  {act.isBooked && <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">Booked</span>}
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">No activities planned yet.</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
              <Map className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No itinerary generated yet.</p>
              <Button className="mt-4 bg-primary" onClick={handleOptimize}>Generate Itinerary</Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-card-border">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Trip Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Budget Utilization</span>
                    <span className="font-medium font-mono">${trip.totalSpent || 0} / ${trip.totalBudget || 0}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${(trip.totalSpent || 0) > (trip.totalBudget || 1) ? 'bg-destructive' : 'bg-primary'}`} 
                      style={{ width: `${Math.min(100, ((trip.totalSpent || 0) / (trip.totalBudget || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Status</div>
                    <div className="font-semibold capitalize">{trip.status}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Travelers</div>
                    <div className="font-semibold">{trip.travelers}</div>
                  </div>
                </div>

                {trip.notes && (
                  <div className="pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Notes</div>
                    <p className="text-sm">{trip.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardContent className="p-0">
               <div className="bg-muted px-4 py-3 border-b border-border flex justify-between items-center">
                 <h3 className="font-bold">Bookings</h3>
                 <Button variant="ghost" size="sm" className="h-6 text-xs text-primary p-0">View All</Button>
               </div>
               <div className="divide-y divide-border">
                  {trip.bookings && trip.bookings.length > 0 ? (
                    trip.bookings.map(booking => (
                      <div key={booking.id} className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                             {booking.type === 'flight' ? <Plane className="h-4 w-4" /> : <MapPin className="h-4 w-4"/>}
                           </div>
                           <div>
                             <div className="font-medium text-sm">{booking.providerName}</div>
                             <div className="text-xs text-muted-foreground">{booking.reference}</div>
                           </div>
                         </div>
                         <div className="text-right">
                           <div className="font-medium text-sm">${booking.amount}</div>
                           <div className={`text-[10px] uppercase font-bold tracking-wider ${booking.status === 'confirmed' ? 'text-emerald-500' : 'text-accent'}`}>{booking.status}</div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center">
                      <AlertCircle className="h-5 w-5 mb-2 opacity-50" />
                      No bookings attached to this trip yet.
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

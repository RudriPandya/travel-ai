import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Building, Map, Search as SearchIcon, Star, Wifi, Car, Coffee, Dumbbell, Clock, Users } from "lucide-react";
import { useSearchFlights, useSearchHotels, useSearchActivities } from "@workspace/api-client-react";

export default function SearchHub() {
  const [flightParams, setFlightParams] = useState({ origin: "", destination: "", date: "" });
  const [flightEnabled, setFlightEnabled] = useState(false);

  const [hotelParams, setHotelParams] = useState({ destination: "", checkIn: "", checkOut: "", guests: "" });
  const [hotelEnabled, setHotelEnabled] = useState(false);

  const [activityParams, setActivityParams] = useState({ destination: "", category: "" });
  const [activityEnabled, setActivityEnabled] = useState(false);

  const { data: flights, isLoading: loadingFlights } = useSearchFlights(
    { origin: flightParams.origin, destination: flightParams.destination, date: flightParams.date },
    { query: { enabled: flightEnabled, queryKey: ["searchFlights", flightParams] } }
  );

  const { data: hotels, isLoading: loadingHotels } = useSearchHotels(
    { destination: hotelParams.destination, checkIn: hotelParams.checkIn, checkOut: hotelParams.checkOut, guests: hotelParams.guests ? parseInt(hotelParams.guests) : undefined },
    { query: { enabled: hotelEnabled, queryKey: ["searchHotels", hotelParams] } }
  );

  const { data: activities, isLoading: loadingActivities } = useSearchActivities(
    { destination: activityParams.destination, category: activityParams.category as any || undefined },
    { query: { enabled: activityEnabled, queryKey: ["searchActivities", activityParams] } }
  );

  const amenityIcon = (a: string) => {
    if (a.toLowerCase().includes("wifi")) return <Wifi className="h-3 w-3" />;
    if (a.toLowerCase().includes("parking") || a.toLowerCase().includes("car")) return <Car className="h-3 w-3" />;
    if (a.toLowerCase().includes("breakfast") || a.toLowerCase().includes("restaurant")) return <Coffee className="h-3 w-3" />;
    if (a.toLowerCase().includes("gym") || a.toLowerCase().includes("fitness")) return <Dumbbell className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search & Book</h1>
        <p className="text-muted-foreground mt-1">Find the best corporate rates and direct routes.</p>
      </div>

      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted p-1 mb-8">
          <TabsTrigger value="flights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Plane className="h-4 w-4 mr-2" /> Flights
          </TabsTrigger>
          <TabsTrigger value="hotels" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building className="h-4 w-4 mr-2" /> Hotels
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Map className="h-4 w-4 mr-2" /> Activities
          </TabsTrigger>
        </TabsList>

        {/* ── FLIGHTS ── */}
        <TabsContent value="flights" className="space-y-6 mt-0">
          <Card className="bg-card border-card-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Search Flights</h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Origin</label>
                  <Input placeholder="SFO" className="bg-background border-border" value={flightParams.origin}
                    onChange={(e) => { setFlightParams({ ...flightParams, origin: e.target.value }); setFlightEnabled(false); }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destination</label>
                  <Input placeholder="HND" className="bg-background border-border" value={flightParams.destination}
                    onChange={(e) => { setFlightParams({ ...flightParams, destination: e.target.value }); setFlightEnabled(false); }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
                  <Input type="date" className="bg-background border-border" value={flightParams.date}
                    onChange={(e) => { setFlightParams({ ...flightParams, date: e.target.value }); setFlightEnabled(false); }} />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setFlightEnabled(true)}
                  disabled={!flightParams.origin || !flightParams.destination || !flightParams.date}>
                  <SearchIcon className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {loadingFlights && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card animate-pulse rounded-xl border border-border" />)}
            </div>
          )}

          {flights?.outbound && flights.outbound.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-2">
                {flights.outbound.length} Results
              </h3>
              {flights.outbound.map((flight) => (
                <Card key={flight.id} className="bg-card border-card-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-0 flex flex-col md:flex-row items-center">
                    <div className="flex-1 p-6 grid grid-cols-3 gap-6 w-full">
                      <div>
                        <div className="font-bold text-lg">{flight.airline}</div>
                        <div className="text-sm text-muted-foreground">{flight.flightNumber} · {flight.cabinClass}</div>
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <div className="text-center">
                          <div className="font-bold text-xl">{flight.departure}</div>
                          <div className="text-sm text-muted-foreground">{flight.origin}</div>
                        </div>
                        <div className="flex-1 px-8 relative flex flex-col items-center justify-center">
                          <div className="text-xs text-muted-foreground mb-1">{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</div>
                          <div className="w-full h-px bg-border relative">
                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{flight.stops === 0 ? "Direct" : `${flight.stops} Stop(s)`}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-xl">{flight.arrival}</div>
                          <div className="text-sm text-muted-foreground">{flight.destination}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted p-6 flex flex-col items-end justify-center w-full md:w-48 border-t md:border-t-0 md:border-l border-border rounded-b-xl md:rounded-bl-none md:rounded-r-xl">
                      <div className="font-bold text-2xl mb-1">${flight.price}</div>
                      <div className="text-xs text-muted-foreground mb-4">incl. taxes</div>
                      <Button className="w-full bg-white text-black hover:bg-white/90">Select</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {flightEnabled && !loadingFlights && flights?.outbound?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
              No flights found for this route. Try different dates or airports.
            </div>
          )}
        </TabsContent>

        {/* ── HOTELS ── */}
        <TabsContent value="hotels" className="space-y-6 mt-0">
          <Card className="bg-card border-card-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Search Hotels</h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destination</label>
                  <Input placeholder="Tokyo, Paris..." className="bg-background border-border" value={hotelParams.destination}
                    onChange={(e) => { setHotelParams({ ...hotelParams, destination: e.target.value }); setHotelEnabled(false); }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-in</label>
                  <Input type="date" className="bg-background border-border" value={hotelParams.checkIn}
                    onChange={(e) => { setHotelParams({ ...hotelParams, checkIn: e.target.value }); setHotelEnabled(false); }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-out</label>
                  <Input type="date" className="bg-background border-border" value={hotelParams.checkOut}
                    onChange={(e) => { setHotelParams({ ...hotelParams, checkOut: e.target.value }); setHotelEnabled(false); }} />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setHotelEnabled(true)}
                  disabled={!hotelParams.destination || !hotelParams.checkIn || !hotelParams.checkOut}>
                  <SearchIcon className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {loadingHotels && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-card animate-pulse rounded-xl border border-border" />)}
            </div>
          )}

          {hotels && hotels.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-2">{hotels.length} Hotels Found</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="bg-card border-card-border hover:border-primary/50 transition-colors overflow-hidden group">
                    <div className="h-36 bg-muted relative overflow-hidden">
                      {hotel.imageUrl ? (
                        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Building className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      {hotel.freeCancellation && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                          Free Cancellation
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {hotel.reviewScore.toFixed(1)}
                        <span className="text-muted-foreground">({hotel.reviewCount})</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-base">{hotel.name}</h3>
                          <p className="text-xs text-muted-foreground">{hotel.neighborhood || hotel.destination}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-bold text-xl">${hotel.pricePerNight}</div>
                          <div className="text-xs text-muted-foreground">/night</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {hotel.amenities.slice(0, 4).map((a) => (
                            <span key={a} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                              {amenityIcon(a)} {a}
                            </span>
                          ))}
                        </div>
                      )}
                      <Button className="w-full bg-primary hover:bg-primary/90" size="sm">Book Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {hotelEnabled && !loadingHotels && hotels?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
              No hotels found for this destination. Try a different city or date range.
            </div>
          )}
        </TabsContent>

        {/* ── ACTIVITIES ── */}
        <TabsContent value="activities" className="space-y-6 mt-0">
          <Card className="bg-card border-card-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Search Activities & Experiences</h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destination</label>
                  <Input placeholder="Tokyo, Paris..." className="bg-background border-border" value={activityParams.destination}
                    onChange={(e) => { setActivityParams({ ...activityParams, destination: e.target.value }); setActivityEnabled(false); }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                  <select
                    value={activityParams.category}
                    onChange={(e) => { setActivityParams({ ...activityParams, category: e.target.value }); setActivityEnabled(false); }}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="adventure">Adventure</option>
                    <option value="culture">Culture</option>
                    <option value="food">Food & Dining</option>
                    <option value="family">Family</option>
                    <option value="wellness">Wellness</option>
                    <option value="tours">Tours</option>
                    <option value="nightlife">Nightlife</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setActivityEnabled(true)}
                  disabled={!activityParams.destination}>
                  <SearchIcon className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {loadingActivities && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-56 bg-card animate-pulse rounded-xl border border-border" />)}
            </div>
          )}

          {activities && activities.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-2">{activities.length} Activities Found</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <Card key={activity.id} className="bg-card border-card-border hover:border-primary/50 transition-colors overflow-hidden group flex flex-col">
                    <div className="h-36 bg-muted relative overflow-hidden">
                      {activity.imageUrl ? (
                        <img src={activity.imageUrl} alt={activity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Map className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge className="capitalize bg-primary/80 text-primary-foreground text-xs border-0">
                          {activity.category}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {activity.reviewScore.toFixed(1)}
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-base mb-1">{activity.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 flex-1 line-clamp-2">{activity.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.floor(activity.duration / 60)}h {activity.duration % 60 > 0 ? `${activity.duration % 60}m` : ""}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {activity.groupSizeMin}–{activity.groupSizeMax}</span>
                      </div>
                      {activity.tags && activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {activity.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-lg">${activity.price}</span>
                          <span className="text-xs text-muted-foreground ml-1">/ person</span>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">Book</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activityEnabled && !loadingActivities && activities?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
              No activities found. Try a different destination or category.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

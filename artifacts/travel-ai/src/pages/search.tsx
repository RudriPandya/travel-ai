import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plane, Building, Map, Search as SearchIcon } from "lucide-react";
import { useSearchFlights, useSearchHotels, useSearchActivities } from "@workspace/api-client-react";

export default function SearchHub() {
  const [flightParams, setFlightParams] = useState({ origin: "", destination: "", date: "" });
  const [flightSearchTrigger, setFlightSearchTrigger] = useState(false);
  
  const { data: flights, isLoading: loadingFlights } = useSearchFlights(
    flightParams, 
    { query: { enabled: flightSearchTrigger, queryKey: ['searchFlights', flightParams] } }
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search & Book</h1>
        <p className="text-muted-foreground mt-1">Find the best corporate rates and direct routes.</p>
      </div>

      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted p-1 mb-8">
          <TabsTrigger value="flights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Plane className="h-4 w-4 mr-2" /> Flights</TabsTrigger>
          <TabsTrigger value="hotels" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Building className="h-4 w-4 mr-2" /> Hotels</TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Map className="h-4 w-4 mr-2" /> Activities</TabsTrigger>
        </TabsList>

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
                  <Input 
                    placeholder="SFO" 
                    className="bg-background border-border"
                    value={flightParams.origin}
                    onChange={(e) => setFlightParams({...flightParams, origin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destination</label>
                  <Input 
                    placeholder="HND" 
                    className="bg-background border-border"
                    value={flightParams.destination}
                    onChange={(e) => setFlightParams({...flightParams, destination: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
                  <Input 
                    type="date" 
                    className="bg-background border-border"
                    value={flightParams.date}
                    onChange={(e) => setFlightParams({...flightParams, date: e.target.value})}
                  />
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90" 
                  onClick={() => setFlightSearchTrigger(true)}
                  disabled={!flightParams.origin || !flightParams.destination || !flightParams.date}
                >
                  <SearchIcon className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {loadingFlights && (
            <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-24 bg-card animate-pulse rounded-xl border border-border"></div>)}
            </div>
          )}

          {flights?.outbound && flights.outbound.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-2">Results</h3>
              {flights.outbound.map((flight) => (
                <Card key={flight.id} className="bg-card border-card-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-0 flex flex-col md:flex-row items-center">
                    <div className="flex-1 p-6 grid grid-cols-3 gap-6 w-full">
                      <div>
                        <div className="font-bold text-lg">{flight.airline}</div>
                        <div className="text-sm text-muted-foreground">{flight.flightNumber} • {flight.cabinClass}</div>
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <div className="text-center">
                          <div className="font-bold text-xl">{flight.departure}</div>
                          <div className="text-sm text-muted-foreground">{flight.origin}</div>
                        </div>
                        <div className="flex-1 px-8 relative flex flex-col items-center justify-center">
                          <div className="text-xs text-muted-foreground mb-1">{Math.floor(flight.duration/60)}h {flight.duration%60}m</div>
                          <div className="w-full h-px bg-border relative">
                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{flight.stops === 0 ? 'Direct' : `${flight.stops} Stop(s)`}</div>
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
        </TabsContent>

        <TabsContent value="hotels" className="space-y-6 mt-0">
           <Card className="bg-card border-card-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Search Hotels</h2>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-sm">Hotel search functionality coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6 mt-0">
          <Card className="bg-card border-card-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Search Activities</h2>
            </div>
            <CardContent className="p-6">
               <p className="text-muted-foreground text-sm">Activities search functionality coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import React from "react";
import { useListBookings } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane, Building, Car, Map, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Bookings() {
  const { data: bookings, isLoading } = useListBookings();

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-5 w-5" />;
      case 'hotel': return <Building className="h-5 w-5" />;
      case 'car_rental': return <Car className="h-5 w-5" />;
      case 'activity': return <Map className="h-5 w-5" />;
      default: return <Map className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-accent" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-1">All your reservations in one place.</p>
      </div>

      <Card className="bg-card border-card-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-xs font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Provider / Reference</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  [1,2,3,4].map(i => (
                    <tr key={i}>
                      <td className="px-6 py-4" colSpan={5}><Skeleton className="h-10 w-full" /></td>
                    </tr>
                  ))
                ) : bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {getIcon(booking.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{booking.providerName}</div>
                            <div className="font-mono text-xs text-muted-foreground">{booking.reference}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground max-w-[200px] truncate" title={booking.description}>{booking.description}</div>
                        <div className="text-xs text-muted-foreground capitalize">{booking.type.replace('_', ' ')} • {booking.passengerCount} pax</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground">{new Date(booking.startDate).toLocaleDateString()}</div>
                        {booking.endDate && <div className="text-xs text-muted-foreground">to {new Date(booking.endDate).toLocaleDateString()}</div>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-mono font-medium">${booking.amount}</div>
                        <div className="text-xs text-muted-foreground uppercase">{booking.currency}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {getStatusIcon(booking.status)}
                          <span className="capitalize font-medium">{booking.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No bookings found.
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

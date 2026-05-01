import React from "react";
import { useGetPriceAlerts } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BellOff, ArrowRight } from "lucide-react";

export default function Alerts() {
  const { data: alerts, isLoading } = useGetPriceAlerts();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Price Alerts</h1>
        <p className="text-muted-foreground mt-1">Never miss a deal on flights or hotels.</p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          [1,2].map(i => <Card key={i}><CardContent className="p-6 h-24 animate-pulse bg-muted rounded-xl"></CardContent></Card>)
        ) : alerts && alerts.length > 0 ? (
          alerts.map(alert => (
            <Card key={alert.id} className="bg-card border-card-border">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${alert.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {alert.active ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{alert.label}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{alert.type} Alert</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Target</div>
                    <div className="font-mono font-medium">${alert.targetPrice}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current</div>
                    <div className={`font-mono font-bold text-lg ${alert.triggered ? 'text-green-500' : 'text-foreground'}`}>
                      ${alert.currentPrice}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
             <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
             <h3 className="text-xl font-medium">No active alerts</h3>
             <p className="text-muted-foreground mt-2">Set up alerts when searching for flights or hotels.</p>
          </div>
        )}
      </div>
    </div>
  );
}

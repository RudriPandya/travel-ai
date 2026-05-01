import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function CorporatePolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Travel Policy</h1>
        <p className="text-muted-foreground mt-1">Configure automated rules and spending limits.</p>
      </div>

      <Card className="bg-card border-card-border">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Policy Configuration</h2>
          <p className="text-muted-foreground max-w-sm">Admin access required to modify global travel policies.</p>
        </CardContent>
      </Card>
    </div>
  );
}

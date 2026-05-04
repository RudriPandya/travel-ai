import React, { useState, useEffect } from "react";
import { useGetTravelPolicy, useUpdateTravelPolicy } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, DollarSign, Plane, Clock, CheckCircle2, Loader2, Star, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CorporatePolicy() {
  const { data: policy, isLoading } = useGetTravelPolicy();
  const updatePolicy = useUpdateTravelPolicy();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    maxHotelRatePerNight: "",
    maxFlightClassShortHaul: "",
    maxFlightClassLongHaul: "",
    advanceBookingDays: "",
    requiresApprovalAbove: "",
    perDiemRate: "",
    preferredAirlines: "",
    preferredHotelChains: "",
  });

  useEffect(() => {
    if (policy) {
      setForm({
        maxHotelRatePerNight: String(policy.maxHotelRatePerNight),
        maxFlightClassShortHaul: policy.maxFlightClassShortHaul,
        maxFlightClassLongHaul: policy.maxFlightClassLongHaul,
        advanceBookingDays: String(policy.advanceBookingDays),
        requiresApprovalAbove: String(policy.requiresApprovalAbove),
        perDiemRate: String(policy.perDiemRate),
        preferredAirlines: policy.preferredAirlines?.join(", ") || "",
        preferredHotelChains: policy.preferredHotelChains?.join(", ") || "",
      });
    }
  }, [policy]);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    updatePolicy.mutate(
      {
        data: {
          maxHotelRatePerNight: parseFloat(form.maxHotelRatePerNight),
          maxFlightClassShortHaul: form.maxFlightClassShortHaul,
          maxFlightClassLongHaul: form.maxFlightClassLongHaul,
          advanceBookingDays: parseInt(form.advanceBookingDays),
          requiresApprovalAbove: parseFloat(form.requiresApprovalAbove),
          perDiemRate: parseFloat(form.perDiemRate),
          preferredAirlines: form.preferredAirlines.split(",").map((s) => s.trim()).filter(Boolean),
          preferredHotelChains: form.preferredHotelChains.split(",").map((s) => s.trim()).filter(Boolean),
        },
      },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
          toast({ title: "Policy updated", description: "Travel policy has been saved successfully." });
        },
        onError: () => {
          toast({ title: "Save failed", description: "Could not update policy. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const inputClass = "bg-background border-border text-foreground";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Policy</h1>
          <p className="text-muted-foreground mt-1">
            Configure automated rules and spending limits.
            {policy?.updatedAt && (
              <span className="ml-2 text-xs text-muted-foreground/70">
                Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 min-w-[140px]"
          onClick={handleSave}
          disabled={updatePolicy.isPending}
        >
          {updatePolicy.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Saved!</>
          ) : (
            <><Shield className="mr-2 h-4 w-4" /> Save Policy</>
          )}
        </Button>
      </div>

      <Card className="bg-card border-card-border">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Spending Limits</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Max Hotel Rate / Night ($)
            </label>
            <Input
              type="number"
              value={form.maxHotelRatePerNight}
              onChange={(e) => set("maxHotelRatePerNight", e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Employees cannot book hotels above this rate without approval.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Per Diem Rate ($/day)
            </label>
            <Input
              type="number"
              value={form.perDiemRate}
              onChange={(e) => set("perDiemRate", e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Daily meal and incidental allowance.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Requires Approval Above ($)
            </label>
            <Input
              type="number"
              value={form.requiresApprovalAbove}
              onChange={(e) => set("requiresApprovalAbove", e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Bookings exceeding this amount need manager approval.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Advance Booking Required (days)
            </label>
            <Input
              type="number"
              value={form.advanceBookingDays}
              onChange={(e) => set("advanceBookingDays", e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Minimum days in advance for bookings.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-card-border">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <CardTitle>Flight Policy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Max Class — Short Haul (&lt; 6h)
            </label>
            <select
              value={form.maxFlightClassShortHaul}
              onChange={(e) => set("maxFlightClassShortHaul", e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Max Class — Long Haul (&gt; 6h)
            </label>
            <select
              value={form.maxFlightClassLongHaul}
              onChange={(e) => set("maxFlightClassLongHaul", e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-card-border">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <CardTitle>Preferred Vendors</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Preferred Airlines
            </label>
            <Input
              value={form.preferredAirlines}
              onChange={(e) => set("preferredAirlines", e.target.value)}
              placeholder="e.g. United Airlines, Delta, Lufthansa"
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Comma-separated list of preferred carriers.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Preferred Hotel Chains
            </label>
            <Input
              value={form.preferredHotelChains}
              onChange={(e) => set("preferredHotelChains", e.target.value)}
              placeholder="e.g. Marriott, Hilton, Hyatt"
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Comma-separated list of preferred hotel groups.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          className="bg-primary hover:bg-primary/90 min-w-[140px]"
          onClick={handleSave}
          disabled={updatePolicy.isPending}
        >
          {updatePolicy.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Saved!</>
          ) : (
            <><Shield className="mr-2 h-4 w-4" /> Save Policy</>
          )}
        </Button>
      </div>
    </div>
  );
}

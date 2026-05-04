import React, { useState } from "react";
import { useGetPriceAlerts, useCreatePriceAlert, useDeletePriceAlert } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, BellOff, ArrowRight, Plus, Trash2, X, Plane, Building } from "lucide-react";

export default function Alerts() {
  const { data: alerts, isLoading } = useGetPriceAlerts();
  const createAlert = useCreatePriceAlert();
  const deleteAlert = useDeletePriceAlert();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "flight" as "flight" | "hotel",
    label: "",
    targetPrice: "",
    currentPrice: "",
  });

  const handleCreate = () => {
    if (!form.label || !form.targetPrice) return;
    createAlert.mutate(
      {
        data: {
          type: form.type,
          label: form.label,
          targetPrice: parseFloat(form.targetPrice),
          currentPrice: form.currentPrice ? parseFloat(form.currentPrice) : parseFloat(form.targetPrice) * 1.1,
          active: true,
        },
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({ type: "flight", label: "", targetPrice: "", currentPrice: "" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteAlert.mutate({ id });
  };

  const allAlerts = alerts ?? [];
  const activeAlerts = allAlerts.filter((a) => a.active);
  const triggeredAlerts = allAlerts.filter((a) => a.triggered);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Price Alerts</h1>
          <p className="text-muted-foreground mt-1">Never miss a deal on flights or hotels.</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? "Cancel" : "New Alert"}
        </Button>
      </div>

      {/* Stats row */}
      {allAlerts.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Alerts", value: activeAlerts.length, color: "text-primary" },
            { label: "Triggered", value: triggeredAlerts.length, color: "text-emerald-500" },
            { label: "Total Alerts", value: allAlerts.length, color: "text-foreground" },
          ].map((s) => (
            <Card key={s.label} className="bg-card border-card-border">
              <CardContent className="p-4 text-center">
                <div className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <Card className="bg-card border-card-border border-primary/30">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg">Create New Alert</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Alert Type</Label>
                <div className="flex gap-2">
                  {(["flight", "hotel"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        form.type === t
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {t === "flight" ? <Plane className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Label</Label>
                <Input
                  placeholder={form.type === "flight" ? "e.g. SFO → NRT (April 2025)" : "e.g. Bali — Alaya Ubud (June)"}
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Target Price ($)</Label>
                <Input
                  type="number"
                  placeholder="750"
                  value={form.targetPrice}
                  onChange={(e) => setForm((f) => ({ ...f, targetPrice: e.target.value }))}
                  className="bg-background border-border font-mono"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Current Price ($) — optional</Label>
                <Input
                  type="number"
                  placeholder="Auto-filled"
                  value={form.currentPrice}
                  onChange={(e) => setForm((f) => ({ ...f, currentPrice: e.target.value }))}
                  className="bg-background border-border font-mono"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCreate}
                disabled={!form.label || !form.targetPrice || createAlert.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createAlert.isPending ? "Creating..." : "Create Alert"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert List */}
      <div className="grid gap-4">
        {isLoading ? (
          [1, 2].map((i) => (
            <Card key={i} className="bg-card border-card-border">
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : allAlerts.length > 0 ? (
          allAlerts.map((alert) => {
            const diff = alert.currentPrice != null && alert.targetPrice != null
              ? ((alert.currentPrice - alert.targetPrice) / alert.targetPrice) * 100
              : null;
            const isBelow = diff !== null && diff <= 0;

            return (
              <Card key={alert.id} className={`bg-card border-card-border transition-colors ${
                alert.triggered ? "border-emerald-500/40" : ""
              }`}>
                <CardContent className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.triggered ? "bg-emerald-500/10 text-emerald-500" :
                      alert.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {alert.active ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base truncate">{alert.label}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground capitalize">{alert.type} Alert</span>
                        {alert.triggered && (
                          <span className="text-xs bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded">
                            TARGET HIT
                          </span>
                        )}
                        {!alert.active && (
                          <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Paused</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Target</div>
                      <div className="font-mono font-semibold">${alert.targetPrice}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current</div>
                      <div className={`font-mono font-bold text-lg ${isBelow ? "text-emerald-500" : "text-foreground"}`}>
                        ${alert.currentPrice}
                      </div>
                      {diff !== null && (
                        <div className={`text-xs font-medium ${isBelow ? "text-emerald-500" : "text-destructive"}`}>
                          {isBelow ? "" : "+"}{diff.toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => handleDelete(alert.id)}
                      disabled={deleteAlert.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No active alerts</h3>
            <p className="text-muted-foreground mt-1 mb-6">Create your first alert to get notified when prices drop.</p>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Alert
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useListApprovals, useApproveRequest, useRejectRequest } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, MapPin, Calendar, DollarSign, User, Building, Clock } from "lucide-react";

export default function CorporateApprovals() {
  const { data: approvals, isLoading } = useListApprovals();
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  const allApprovals = approvals ?? [];
  const pendingApprovals = allApprovals.filter((a) => a.status === "pending");
  const displayedApprovals = activeTab === "pending" ? pendingApprovals : allApprovals;

  const handleApprove = (id: number) => {
    approveRequest.mutate({ id, data: { reason: "Approved by manager" } });
  };

  const handleReject = (id: number) => {
    rejectRequest.mutate({ id, data: { reason: "Does not meet travel policy requirements" } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and manage out-of-policy travel requests.</p>
        </div>
        {pendingApprovals.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-2 rounded-lg text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            {pendingApprovals.length} pending review
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(["pending", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "pending" ? `Pending (${pendingApprovals.length})` : `All (${allApprovals.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
        ) : displayedApprovals.length === 0 ? (
          <Card className="bg-card border-card-border">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">All clear!</h2>
              <p className="text-muted-foreground max-w-sm">
                {activeTab === "pending"
                  ? "All travel requests are within policy or have already been processed."
                  : "No travel approval requests yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          displayedApprovals.map((approval) => (
            <Card key={approval.id} className="bg-card border-card-border overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg">{approval.travelerName}</h3>
                        <span className="text-sm text-muted-foreground">{approval.department}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                            approval.status === "pending"
                              ? "bg-amber-500/10 text-amber-500"
                              : approval.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {approval.status}
                        </span>
                        {!approval.policyCompliant && approval.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400">
                            <AlertTriangle className="h-3 w-3" /> Out of policy
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{approval.travelerEmail}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-xl">${parseFloat(approval.totalAmount).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground uppercase">{approval.currency}</div>
                  </div>
                </div>

                <div className="px-6 pb-4 space-y-3">
                  <div className="font-semibold">{approval.tripDescription}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary/70" /> {approval.destination}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary/70" /> {approval.travelDates}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary/70" /> Submitted {new Date(approval.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {approval.policyNotes && (
                    <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{approval.policyNotes}</span>
                    </div>
                  )}
                </div>

                {approval.status === "pending" && (
                  <div className="px-6 pb-6 flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
                      onClick={() => handleReject(approval.id)}
                      disabled={rejectRequest.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1.5" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleApprove(approval.id)}
                      disabled={approveRequest.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

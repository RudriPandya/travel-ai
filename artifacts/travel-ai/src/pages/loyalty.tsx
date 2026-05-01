import React from "react";
import { useGetLoyaltyAccount, useListRewards } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Star, Zap, Plane, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Loyalty() {
  const { data: account, isLoading: loadingAccount } = useGetLoyaltyAccount();
  const { data: rewards, isLoading: loadingRewards } = useListRewards();

  if (loadingAccount) {
    return <div className="space-y-8"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voyage Rewards</h1>
        <p className="text-muted-foreground mt-1">Unlock exclusive benefits and premium experiences.</p>
      </div>

      {account && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sidebar via-background to-card border border-border p-8 md:p-12">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold uppercase tracking-wider mb-6">
                <Award className="h-4 w-4" />
                {account.tierName}
              </div>
              <div className="text-6xl md:text-8xl font-bold font-mono tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                {account.points.toLocaleString()}
              </div>
              <div className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Available Points</div>
            </div>

            <div className="w-full md:w-1/2 max-w-md space-y-4 bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-border">
              <div className="flex justify-between items-end text-sm">
                <div>
                  <span className="text-muted-foreground">Next Tier:</span> <span className="font-bold text-accent">{account.nextTier}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold">{account.pointsToNextTier?.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs ml-1">pts to go</span>
                </div>
              </div>
              
              <Progress 
                value={((account.points) / ((account.points) + (account.pointsToNextTier || 1))) * 100} 
                className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" 
              />

              <div className="pt-4 mt-4 border-t border-border/50">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">Current Benefits</h4>
                <ul className="space-y-2">
                  {account.benefits.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-2 mb-6">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingRewards ? (
             [1,2,3].map(i => <Skeleton key={i} className="h-80 w-full rounded-xl" />)
          ) : rewards && rewards.length > 0 ? (
            rewards.map(reward => (
              <Card key={reward.id} className="bg-card border-card-border overflow-hidden hover:border-accent/50 transition-colors group flex flex-col">
                <div className="h-40 bg-muted relative overflow-hidden">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/10">
                      <Star className="h-10 w-10 text-accent" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-accent border border-accent/20">
                    {reward.category}
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2">{reward.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{reward.description}</p>
                  <Button className="w-full bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground border border-accent/20" disabled={!reward.available || (account ? account.points < reward.pointsCost : true)}>
                    Redeem for {reward.pointsCost.toLocaleString()} pts
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
              No rewards available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

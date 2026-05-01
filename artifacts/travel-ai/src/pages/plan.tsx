import React, { useState } from "react";
import { useAiPlanTrip, useCreateTrip } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MapPin, Calendar, DollarSign, ArrowRight, Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export default function PlanTrip() {
  const [prompt, setPrompt] = useState("");
  const [variant, setVariant] = useState<"budget" | "balanced" | "premium">("balanced");
  const planTrip = useAiPlanTrip();
  const createTrip = useCreateTrip();
  const [, setLocation] = useLocation();

  const handlePlan = () => {
    if (!prompt) return;
    planTrip.mutate({ data: { prompt, variant } });
  };

  const handleSave = (itinerary: any) => {
    // Save to trips and redirect
    createTrip.mutate({ 
      data: {
        name: itinerary.name,
        destination: itinerary.destination,
        startDate: new Date().toISOString(), // Mock dates for now
        endDate: new Date(Date.now() + itinerary.duration * 86400000).toISOString(),
        totalBudget: itinerary.estimatedBudget,
        travelers: 1, // Default
        notes: itinerary.summary
      } 
    }, {
      onSuccess: (trip) => {
        setLocation(`/trips/${trip.id}`);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mx-auto">
          <Sparkles className="h-4 w-4" />
          <span>AI Trip Designer</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Where to next?</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Describe your ideal trip in plain English. Our AI will craft a complete, day-by-day itinerary optimized for logistics, opening hours, and flow.
        </p>
      </div>

      <Card className="bg-card border-primary/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="relative">
            <textarea
              className="w-full min-h-[120px] bg-background border border-border rounded-xl p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
              placeholder="e.g., Plan a 10-day trip to Japan in April for 2 people. We love food, history, and want a mix of cities and countryside. Budget is around $4,000."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['budget', 'balanced', 'premium'].map((v) => (
                <Button 
                  key={v}
                  variant={variant === v ? 'default' : 'outline'}
                  className={`capitalize flex-1 sm:flex-none ${variant === v ? 'bg-primary text-primary-foreground' : 'border-border'}`}
                  onClick={() => setVariant(v as any)}
                >
                  {v}
                </Button>
              ))}
            </div>
            
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={handlePlan}
              disabled={!prompt || planTrip.isPending}
            >
              {planTrip.isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
              ) : (
                <>Generate Itinerary <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {planTrip.isPending && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm font-medium animate-pulse">Analyzing logistics, checking hours, and building the perfect route...</p>
          </motion.div>
        )}

        {planTrip.data && !planTrip.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pt-8 border-t border-border"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{planTrip.data.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {planTrip.data.destination}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {planTrip.data.duration} Days</div>
                  <div className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-primary" /> ~${planTrip.data.estimatedBudget}</div>
                </div>
              </div>
              <Button onClick={() => handleSave(planTrip.data)} className="bg-white text-black hover:bg-white/90">
                <Save className="mr-2 h-4 w-4" /> Save Trip
              </Button>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground border-l-2 border-primary pl-4">{planTrip.data.summary}</p>

            <div className="space-y-8">
              {planTrip.data.days.map((day, idx) => (
                <div key={idx} className="relative pl-8 md:pl-0">
                  {/* Timeline line */}
                  <div className="absolute left-[11px] md:left-auto md:right-full md:mr-8 top-0 bottom-0 w-px bg-border/50"></div>
                  
                  <div className="md:flex gap-8">
                    <div className="md:w-32 flex-shrink-0 relative mb-4 md:mb-0 text-left md:text-right">
                      <div className="absolute left-[-33px] md:left-auto md:-right-[37px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>
                      <div className="font-bold text-lg text-white">Day {day.dayNumber}</div>
                      <div className="text-sm font-medium text-primary mt-1">${day.estimatedCost}</div>
                    </div>
                    
                    <Card className="flex-1 bg-card/50 border-card-border">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-xl mb-4 text-white">{day.title}</h3>
                        <div className="space-y-6">
                          {day.activities.map((act, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="w-16 flex-shrink-0 text-sm font-medium text-muted-foreground pt-1 capitalize">{act.timeSlot}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white text-base">{act.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1 mb-2">{act.description}</p>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><MapPin className="h-3 w-3" /> {act.location}</span>
                                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-md">~{act.duration}h</span>
                                </div>
                                {act.tips && <p className="mt-2 text-xs italic text-accent flex items-center gap-1"><Sparkles className="h-3 w-3" /> {act.tips}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

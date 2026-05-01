import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, Globe, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <nav className="h-20 flex items-center justify-between px-8 border-b border-border/50">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <Plane className="h-8 w-8" />
          <span>VoyageAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log In</Link>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="px-8 py-24 md:py-32 max-w-6xl mx-auto text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>The future of corporate travel</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
            Outgrow booking.com. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Travel brilliantly.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            VoyageAI handles the tedious parts of travel—itinerary building, disruption recovery, and expense categorization—so you can focus on the experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto">
            <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90" asChild>
              <Link href="/dashboard">Open Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="bg-card py-24 px-8 border-y border-border/50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Itinerary Planning</h3>
              <p className="text-muted-foreground">Type a simple prompt and get a complete, optimize day-by-day itinerary tailored to your preferences and budget.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Corporate Policy Enforcement</h3>
              <p className="text-muted-foreground">Automated compliance checks, budget tracking, and instant approval workflows for your entire team.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                <Plane className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proactive Disruption Management</h3>
              <p className="text-muted-foreground">Get instant alerts and one-click rebooking options when flights are delayed or cancelled.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 px-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>© 2025 VoyageAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

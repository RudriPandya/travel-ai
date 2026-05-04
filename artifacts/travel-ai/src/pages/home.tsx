import React from "react";
import { Link } from "wouter";
import { useGetPopularDestinations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, Globe, Shield, Zap, Star, MapPin, TrendingUp, Building2, CreditCard } from "lucide-react";

export default function Home() {
  const { data: destinations } = useGetPopularDestinations();
  const topDestinations = destinations?.slice(0, 4) ?? [];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <nav className="h-20 flex items-center justify-between px-8 border-b border-border/50">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <Plane className="h-8 w-8" />
          <span>VoyageAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="px-8 py-24 md:py-32 max-w-6xl mx-auto w-full text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>The future of corporate travel</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
            Outgrow booking.com.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">
              Travel brilliantly.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            VoyageAI handles the tedious parts of travel—itinerary building, disruption recovery, and expense categorization—so you can focus on the experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90" asChild>
              <Link href="/dashboard">Open Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border hover:bg-muted" asChild>
              <Link href="/plan">Plan a Trip with AI</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl w-full">
            {[
              { value: "50K+", label: "Trips planned" },
              { value: "$2.4M", label: "Saved on travel" },
              { value: "98%", label: "Policy compliance" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold font-mono text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-card py-24 px-8 border-y border-border/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything travel, in one platform</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">From booking to expense reporting, we handle every mile of the journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Globe className="h-6 w-6 text-primary" />,
                  bg: "bg-primary/10",
                  title: "AI Itinerary Planning",
                  desc: "Type a prompt, get a complete day-by-day itinerary tailored to your preferences and budget.",
                },
                {
                  icon: <Shield className="h-6 w-6 text-accent" />,
                  bg: "bg-accent/10",
                  title: "Corporate Policy Enforcement",
                  desc: "Automated compliance checks, budget tracking, and instant approval workflows for your entire team.",
                },
                {
                  icon: <Plane className="h-6 w-6 text-blue-400" />,
                  bg: "bg-blue-400/10",
                  title: "Disruption Management",
                  desc: "Instant alerts and one-click rebooking options when flights are delayed or cancelled.",
                },
                {
                  icon: <CreditCard className="h-6 w-6 text-emerald-400" />,
                  bg: "bg-emerald-400/10",
                  title: "Smart Expense Tracking",
                  desc: "Auto-categorize receipts, submit reports, and sync with your accounting software.",
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-orange-400" />,
                  bg: "bg-orange-400/10",
                  title: "Price Alerts",
                  desc: "Set fare targets and get notified the moment prices drop on flights and hotels.",
                },
                {
                  icon: <Building2 className="h-6 w-6 text-purple-400" />,
                  bg: "bg-purple-400/10",
                  title: "Loyalty Rewards",
                  desc: "Track points across all your loyalty programs and maximize rewards on every trip.",
                },
              ].map((feature) => (
                <div key={feature.title} className="p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-colors group">
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        {topDestinations.length > 0 && (
          <section className="py-24 px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Destinations</h2>
                  <p className="text-muted-foreground">Hand-picked cities loved by our travellers.</p>
                </div>
                <Button variant="ghost" asChild className="text-primary hidden sm:flex">
                  <Link href="/search">Explore all <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {topDestinations.map((dest) => (
                  <Link key={dest.id} href="/search">
                    <div className="group relative rounded-2xl overflow-hidden border border-border h-64 cursor-pointer">
                      {dest.imageUrl ? (
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-lg text-white">{dest.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {dest.country}
                          </span>
                          {dest.averageRating && (
                            <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                              <Star className="h-3 w-3 fill-current" /> {dest.averageRating}
                            </span>
                          )}
                        </div>
                        {dest.avgFlightPrice && (
                          <div className="mt-1 text-xs text-white/60 font-mono">
                            Flights from <span className="text-white font-bold">${dest.avgFlightPrice}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-card border-t border-border/50 py-24 px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to travel smarter?</h2>
            <p className="text-muted-foreground text-lg mb-8">Join thousands of teams who use VoyageAI to make every business trip effortless.</p>
            <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90" asChild>
              <Link href="/dashboard">Start for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 px-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>© 2025 VoyageAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

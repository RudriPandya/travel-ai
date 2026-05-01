import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Map, 
  Search, 
  Briefcase, 
  CreditCard, 
  Award, 
  Building2, 
  CheckSquare, 
  ShieldCheck, 
  User, 
  Bell, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Map, label: "Plan Trip", href: "/plan" },
      { icon: Search, label: "Search", href: "/search" },
      { icon: MessageSquare, label: "AI Assistant", href: "/assistant" },
    ]
  },
  {
    title: "Travel",
    items: [
      { icon: Briefcase, label: "My Trips", href: "/trips" },
      { icon: Plane, label: "Bookings", href: "/bookings" },
      { icon: CreditCard, label: "Expenses", href: "/expenses" },
      { icon: Bell, label: "Price Alerts", href: "/alerts" },
    ]
  },
  {
    title: "Rewards",
    items: [
      { icon: Award, label: "Loyalty", href: "/loyalty" },
    ]
  },
  {
    title: "Corporate",
    items: [
      { icon: Building2, label: "Overview", href: "/corporate" },
      { icon: CheckSquare, label: "Approvals", href: "/corporate/approvals" },
      { icon: ShieldCheck, label: "Policy", href: "/corporate/policy" },
    ]
  },
  {
    title: "Settings",
    items: [
      { icon: User, label: "Profile", href: "/profile" },
    ]
  }
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (val: boolean) => void }) {
  const [location] = useLocation();

  return (
    <div className={`h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Plane className="h-6 w-6" />
            <span>VoyageAI</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full text-primary">
            <Plane className="h-6 w-6" />
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden md:flex text-muted-foreground hover:text-foreground">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {NAV_ITEMS.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1 px-2">
              {section.items.map((item, i) => {
                const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href) && item.href !== '/corporate');
                const Icon = item.icon;
                return (
                  <Link key={i} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'}`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                    {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

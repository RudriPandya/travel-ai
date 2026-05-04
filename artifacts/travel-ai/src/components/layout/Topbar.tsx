import React, { useState, useRef, useEffect } from "react";
import { Bell, Search as SearchIcon, CheckCheck, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetProfile, useListNotifications, useMarkNotificationRead } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const TYPE_COLORS: Record<string, string> = {
  booking_confirmation: "bg-emerald-500",
  price_drop: "bg-accent",
  check_in_reminder: "bg-primary",
  flight_status: "bg-blue-500",
  visa_expiry: "bg-destructive",
  approval_required: "bg-amber-500",
  safety_alert: "bg-destructive",
  points_expiry: "bg-purple-500",
  general: "bg-muted-foreground",
};

export default function Topbar() {
  const { data: profile } = useGetProfile();
  const { data: allNotifications } = useListNotifications({});
  const { data: unreadNotifications } = useListNotifications({ unread: true });
  const markRead = useMarkNotificationRead();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = unreadNotifications?.length ?? 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleMarkRead = (id: number) => {
    markRead.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["listNotifications"] });
        },
      }
    );
  };

  const handleMarkAllRead = () => {
    fetch(`${import.meta.env.BASE_URL}api/notifications/read-all`, { method: "POST" }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["listNotifications"] });
    });
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <div className="relative w-64 md:w-96">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trips, flights, expenses..."
            className="pl-9 bg-muted border-none h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4" ref={panelRef}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-accent rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-accent-foreground leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {open && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={handleMarkAllRead}
                    >
                      <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {!allNotifications || allNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  allNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
                    >
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${TYPE_COLORS[n.type] ?? "bg-muted-foreground"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-tight ${!n.isRead ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{formatTime(n.createdAt)}</p>
                      </div>
                      {!n.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleMarkRead(n.id)}
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={profile?.avatarUrl || ""} />
            <AvatarFallback className="bg-primary/20 text-primary">{profile?.firstName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

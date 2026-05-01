import React from "react";
import { Bell, Search as SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetProfile } from "@workspace/api-client-react";

export default function Topbar() {
  const { data: profile } = useGetProfile();

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
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border border-background"></span>
        </Button>
        
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

import React from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Plane, Settings } from "lucide-react";

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile();

  if (isLoading) {
    return <div className="space-y-8 max-w-3xl mx-auto"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and travel preferences.</p>
      </div>

      <Card className="bg-card border-card-border">
        <CardHeader className="border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">First Name</label>
              <Input defaultValue={profile?.firstName} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Name</label>
              <Input defaultValue={profile?.lastName} className="bg-background border-border" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
            <Input defaultValue={profile?.email} disabled className="bg-muted border-border opacity-70" />
          </div>
          <div className="pt-4 text-right">
            <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-card-border">
        <CardHeader className="border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <CardTitle>Travel Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Seat Preference</label>
              <Input defaultValue={profile?.seatPreference || ''} placeholder="e.g. Aisle" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Meal Preference</label>
              <Input defaultValue={profile?.mealPreference || ''} placeholder="e.g. Vegetarian" className="bg-background border-border" />
            </div>
          </div>
           <div className="pt-4 text-right">
            <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

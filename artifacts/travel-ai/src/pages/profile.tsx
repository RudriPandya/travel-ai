import React, { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Plane, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [personal, setPersonal] = useState({ firstName: "", lastName: "" });
  const [prefs, setPrefs] = useState({ seatPreference: "", mealPreference: "" });
  const [savedPersonal, setSavedPersonal] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState(false);

  useEffect(() => {
    if (profile) {
      setPersonal({ firstName: profile.firstName || "", lastName: profile.lastName || "" });
      setPrefs({ seatPreference: profile.seatPreference || "", mealPreference: profile.mealPreference || "" });
    }
  }, [profile]);

  const handleSavePersonal = () => {
    updateProfile.mutate(
      { data: { firstName: personal.firstName, lastName: personal.lastName } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getProfile"] });
          setSavedPersonal(true);
          setTimeout(() => setSavedPersonal(false), 2000);
          toast({ title: "Profile updated", description: "Your personal information has been saved." });
        },
        onError: () => {
          toast({ title: "Save failed", description: "Could not save profile. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const handleSavePrefs = () => {
    updateProfile.mutate(
      { data: { seatPreference: prefs.seatPreference, mealPreference: prefs.mealPreference } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getProfile"] });
          setSavedPrefs(true);
          setTimeout(() => setSavedPrefs(false), 2000);
          toast({ title: "Preferences saved", description: "Your travel preferences have been updated." });
        },
        onError: () => {
          toast({ title: "Save failed", description: "Could not save preferences. Please try again.", variant: "destructive" });
        },
      }
    );
  };

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
              <Input
                value={personal.firstName}
                onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Name</label>
              <Input
                value={personal.lastName}
                onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                className="bg-background border-border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
            <Input defaultValue={profile?.email} disabled className="bg-muted border-border opacity-70" />
          </div>
          <div className="pt-4 text-right">
            <Button
              className="bg-primary hover:bg-primary/90 min-w-[130px]"
              onClick={handleSavePersonal}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : savedPersonal ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Saved!</>
              ) : (
                "Save Changes"
              )}
            </Button>
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
              <Input
                value={prefs.seatPreference}
                onChange={(e) => setPrefs({ ...prefs, seatPreference: e.target.value })}
                placeholder="e.g. Aisle"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Meal Preference</label>
              <Input
                value={prefs.mealPreference}
                onChange={(e) => setPrefs({ ...prefs, mealPreference: e.target.value })}
                placeholder="e.g. Vegetarian"
                className="bg-background border-border"
              />
            </div>
          </div>
          <div className="pt-4 text-right">
            <Button
              className="bg-primary hover:bg-primary/90 min-w-[150px]"
              onClick={handleSavePrefs}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : savedPrefs ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Saved!</>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

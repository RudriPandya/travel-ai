import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import AppLayout from "@/components/layout/AppLayout";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import PlanTrip from "@/pages/plan";
import SearchHub from "@/pages/search";
import TripsList from "@/pages/trips/index";
import TripDetail from "@/pages/trips/[id]";
import Bookings from "@/pages/bookings";
import Expenses from "@/pages/expenses";
import Loyalty from "@/pages/loyalty";
import Profile from "@/pages/profile";
import CorporateDashboard from "@/pages/corporate/dashboard";
import CorporateApprovals from "@/pages/corporate/approvals";
import CorporatePolicy from "@/pages/corporate/policy";
import Alerts from "@/pages/alerts";
import Assistant from "@/pages/assistant";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <AppLayout><Dashboard /></AppLayout>
      </Route>
      <Route path="/plan">
        <AppLayout><PlanTrip /></AppLayout>
      </Route>
      <Route path="/search">
        <AppLayout><SearchHub /></AppLayout>
      </Route>
      <Route path="/trips">
        <AppLayout><TripsList /></AppLayout>
      </Route>
      <Route path="/trips/:id">
        {params => <AppLayout><TripDetail id={parseInt(params.id)} /></AppLayout>}
      </Route>
      <Route path="/bookings">
        <AppLayout><Bookings /></AppLayout>
      </Route>
      <Route path="/expenses">
        <AppLayout><Expenses /></AppLayout>
      </Route>
      <Route path="/loyalty">
        <AppLayout><Loyalty /></AppLayout>
      </Route>
      <Route path="/profile">
        <AppLayout><Profile /></AppLayout>
      </Route>
      <Route path="/corporate">
        <AppLayout><CorporateDashboard /></AppLayout>
      </Route>
      <Route path="/corporate/approvals">
        <AppLayout><CorporateApprovals /></AppLayout>
      </Route>
      <Route path="/corporate/policy">
        <AppLayout><CorporatePolicy /></AppLayout>
      </Route>
      <Route path="/alerts">
        <AppLayout><Alerts /></AppLayout>
      </Route>
      <Route path="/assistant">
        <AppLayout><Assistant /></AppLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Intro from "@/pages/Intro";
import Home from "@/pages/Home";
import Create from "@/pages/Create";
import Gift from "@/pages/Gift";
import Tech from "@/pages/Tech";
import Requests from "@/pages/Requests";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/intro">
        <ProtectedRoute>
          <Intro />
        </ProtectedRoute>
      </Route>
      <Route path="/home">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/create">
        <ProtectedRoute>
          <Create />
        </ProtectedRoute>
      </Route>
      <Route path="/gift/:id" component={Gift} />
      <Route path="/tech" component={Tech} />
      <Route path="/requests" component={Requests} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

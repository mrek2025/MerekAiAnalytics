import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ImageAnalysis from "./pages/ImageAnalysis";
import BrandAnalysis from "./pages/BrandAnalysis";
import NotFound from "./pages/not-found";
import ChatbotButton from "./components/ChatbotButton";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/image-analysis" component={ImageAnalysis} />
        <Route path="/brand-analysis" component={BrandAnalysis} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatbotButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerContracts from "./pages/owner/OwnerContracts";
import CreateContract from "./pages/owner/CreateContract";
import ContractDetail from "./pages/owner/ContractDetail";
import OwnerProposals from "./pages/owner/OwnerProposals";
import ManufacturerDashboard from "./pages/manufacturer/ManufacturerDashboard";
import BrowseLicenses from "./pages/manufacturer/BrowseLicenses";
import SubmitProposal from "./pages/manufacturer/SubmitProposal";
import ManufacturerProposals from "./pages/manufacturer/ManufacturerProposals";
import ManufacturerProducts from "./pages/manufacturer/ManufacturerProducts";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/examples/ip-royalties">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/contracts"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerContracts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/contracts/new"
              element={
                <ProtectedRoute requiredRole="owner">
                  <CreateContract />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/contracts/:id"
              element={
                <ProtectedRoute requiredRole="owner">
                  <ContractDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/proposals"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerProposals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturer/dashboard"
              element={
                <ProtectedRoute requiredRole="manufacturer">
                  <ManufacturerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturer/browse"
              element={
                <ProtectedRoute requiredRole="manufacturer">
                  <BrowseLicenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturer/propose/:contractId"
              element={
                <ProtectedRoute requiredRole="manufacturer">
                  <SubmitProposal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturer/proposals"
              element={
                <ProtectedRoute requiredRole="manufacturer">
                  <ManufacturerProposals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturer/products"
              element={
                <ProtectedRoute requiredRole="manufacturer">
                  <ManufacturerProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

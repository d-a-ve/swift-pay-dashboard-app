
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import SendMoney from "./pages/SendMoney";
import TransactionHistory from "./pages/TransactionHistory";
import BuyUtilities from "./pages/BuyUtilities";
import FundWallet from "./pages/FundWallet";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Client Routes */}
            <Route path="/dashboard" element={
              <RoleProtectedRoute allowedRoles={['client']}>
                <Dashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/send-money" element={
              <RoleProtectedRoute allowedRoles={['client']}>
                <SendMoney />
              </RoleProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <RoleProtectedRoute allowedRoles={['client']}>
                <Marketplace />
              </RoleProtectedRoute>
            } />
            
            {/* Vendor Routes */}
            <Route path="/vendor" element={
              <RoleProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </RoleProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            } />
            
            {/* Shared Routes */}
            <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
            <Route path="/utilities" element={<ProtectedRoute><BuyUtilities /></ProtectedRoute>} />
            <Route path="/fund-wallet" element={<ProtectedRoute><FundWallet /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

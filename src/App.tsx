
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ClientesListPage from "./pages/ClientesListPage";
import ClienteFormPage from "./pages/ClienteFormPage";
import CobrancasListPage from "./pages/CobrancasListPage";
import CobrancaFormPage from "./pages/CobrancaFormPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminEmpresaFormPage from "./pages/AdminEmpresaFormPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas de autenticação */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Rotas de administrador */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/empresas/nova" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminEmpresaFormPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas protegidas com layout para empresas */}
            <Route 
              element={
                <ProtectedRoute requiredRole="empresa">
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/clientes" element={<ClientesListPage />} />
              <Route path="/clientes/novo" element={<ClienteFormPage />} />
              <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
              <Route path="/clientes/:clienteId/cobrancas" element={<CobrancasListPage />} />
              <Route path="/clientes/:clienteId/cobrancas/nova" element={<CobrancaFormPage />} />
              <Route path="/clientes/:clienteId/cobrancas/novo" element={<Navigate to="../nova" replace />} />
              <Route path="/clientes/:clienteId/cobrancas/:cobrancaId" element={<CobrancaFormPage />} />
              <Route path="/clientes/:clienteId/cobrancas/editar/:cobrancaId" element={<CobrancaFormPage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

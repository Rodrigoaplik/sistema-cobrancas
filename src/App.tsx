
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ClientesListPage from "./pages/ClientesListPage";
import ClienteFormPage from "./pages/ClienteFormPage";
import CobrancasListPage from "./pages/CobrancasListPage";
import CobrancaFormPage from "./pages/CobrancaFormPage";

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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/clientes" element={<ClientesListPage />} />
            <Route path="/clientes/novo" element={<ClienteFormPage />} />
            <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
            <Route path="/clientes/:clienteId/cobrancas" element={<CobrancasListPage />} />
            <Route path="/clientes/:clienteId/cobrancas/nova" element={<CobrancaFormPage />} />
            <Route path="/clientes/:clienteId/cobrancas/novo" element={<Navigate to="../nova" replace />} />
            <Route path="/clientes/:clienteId/cobrancas/:cobrancaId" element={<CobrancaFormPage />} />
            <Route path="/clientes/:clienteId/cobrancas/editar/:cobrancaId" element={<CobrancaFormPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

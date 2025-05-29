
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Shield, Users, Plus, FileText, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role === 'empresa') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user.nome}!
          </h1>
          <p className="text-gray-600">
            Gerencie seus clientes e cobranças de forma eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Card Clientes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Clientes
              </CardTitle>
              <CardDescription>
                Gerencie seus clientes cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/clientes">
                  Ver Clientes
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/clientes/novo">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Cliente
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card Relatórios */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Relatórios
              </CardTitle>
              <CardDescription>
                Visualize dados e estatísticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/relatorios">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Relatórios
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card Ações Rápidas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso rápido às principais funções
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/clientes">
                  <Users className="mr-2 h-4 w-4" />
                  Listar Clientes
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/relatorios">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/9fd08ae1-acaa-4358-9f91-97f5a7c8b1d8.png')`,
        backgroundSize: 'cover'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center backdrop-blur-sm bg-white/40 p-8 rounded-xl shadow-xl">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl text-shadow">
            Sistema de Gerenciamento de Cobranças
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-800 font-medium">
            Gerencie seus clientes e pagamentos de forma eficiente.
          </p>
          
          {/* Seção de Login */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Acesse sua conta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Login Empresa */}
              <div className="bg-white/60 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Empresas</h3>
                  <p className="text-sm text-gray-700 text-center">
                    Acesse o sistema para gerenciar suas cobranças e clientes
                  </p>
                  <Button asChild className="w-full shadow-lg hover:shadow-xl transition-all">
                    <Link to="/login">
                      <Users className="mr-2 h-4 w-4" />
                      Login Empresa
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Login Administrador */}
              <div className="bg-white/60 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Administrador</h3>
                  <p className="text-sm text-gray-700 text-center">
                    Painel administrativo para gerenciar empresas e usuários
                  </p>
                  <Button asChild variant="outline" className="w-full bg-white/60 border-red-300 text-red-700 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all">
                    <Link to="/admin/login">
                      <Shield className="mr-2 h-4 w-4" />
                      Login Admin
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Shield, Users } from "lucide-react";

const Index = () => {
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

          {/* Seção de Ações Rápidas */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" variant="outline" className="bg-white/60 border-gray-400 text-gray-800 hover:bg-white/80 shadow-lg hover:shadow-xl transition-all">
                <Link to="/clientes">Ver Clientes</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/60 border-gray-400 text-gray-800 hover:bg-white/80 shadow-lg hover:shadow-xl transition-all">
                <Link to="/clientes/novo">Cadastrar Cliente</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/60 border-gray-400 text-gray-800 hover:bg-white/80 shadow-lg hover:shadow-xl transition-all">
                <Link to="/relatorios">Relatórios</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
              <Link to="/clientes">Ver Clientes</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/60 border-gray-400 text-gray-800 hover:bg-white/80 shadow-lg hover:shadow-xl transition-all">
              <Link to="/clientes/novo">Cadastrar Cliente</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

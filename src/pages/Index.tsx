
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Sistema de Gerenciamento de Cobranças
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Gerencie seus clientes e pagamentos de forma eficiente.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/clientes">Ver Clientes</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/clientes/novo">Cadastrar Cliente</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

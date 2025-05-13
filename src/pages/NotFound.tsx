
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi removida.
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para a página inicial
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/clientes" className="flex items-center justify-center">
              Ir para lista de clientes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-10 bg-white shadow-md backdrop-blur-sm bg-white/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Sistema de Cobranças
            </Link>
            <nav className="flex space-x-4">
              <Link
                to="/clientes"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/clientes")
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Clientes
              </Link>
              <Link
                to="/"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === "/"
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Início
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-white shadow-inner mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Sistema de Gerenciamento de Cobranças
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

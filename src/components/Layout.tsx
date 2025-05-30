
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-10 bg-white shadow-md backdrop-blur-sm bg-white/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Sistema de Cobranças
            </Link>
            
            <div className="flex items-center gap-4">
              {isMobile ? (
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              ) : (
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
                    to="/relatorios"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      isActive("/relatorios")
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    Relatórios
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
              )}

              {/* Menu do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.nome}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Menu móvel */}
          {isMobile && mobileMenuOpen && (
            <nav className="mt-4 pb-2 flex flex-col space-y-2 animate-in slide-in-from-top duration-300">
              <Link
                to="/clientes"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/clientes")
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={toggleMobileMenu}
              >
                Clientes
              </Link>
              <Link
                to="/relatorios"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/relatorios")
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={toggleMobileMenu}
              >
                Relatórios
              </Link>
              <Link
                to="/"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === "/"
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={toggleMobileMenu}
              >
                Início
              </Link>
            </nav>
          )}
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

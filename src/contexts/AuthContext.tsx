
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getUser();
        if (currentUser && authService.getToken()) {
          const isValid = await authService.verifyToken();
          if (isValid) {
            setUser(currentUser);
          } else {
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    const result = await authService.login(email, senha);
    setUser(result.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user && !!authService.getToken();

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};


import api from './api';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: Usuario;
  token: string;
}

const authService = {
  login: async (email: string, senha: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, user } = response.data;
      
      // Armazenar token JWT e dados do usuário no localStorage
      localStorage.setItem('@app:token', token);
      localStorage.setItem('@app:user', JSON.stringify(user));
      
      // Adicionar o token JWT no cabeçalho padrão para requisições futuras
      api.defaults.headers.authorization = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('@app:token');
    localStorage.removeItem('@app:user');
    api.defaults.headers.authorization = '';
  },
  
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('@app:token');
    return !!token;
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('@app:token');
  },
  
  getUser: (): Usuario | null => {
    const userStr = localStorage.getItem('@app:user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Verificar o token atual (útil para verificar se o token expirou)
  verificarToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('@app:token');
      if (!token) return false;
      
      const response = await api.get('/auth/verify');
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }
};

// Configurar interceptor para requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@app:token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Configurar interceptor para respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authService;


import axios from 'axios';
import { AuthUser } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AuthService {
  private token: string | null = null;
  private user: AuthUser | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  async login(email: string, senha: string): Promise<{ user: AuthUser; token: string }> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        senha
      });

      const { user, token } = response.data;
      
      this.token = token;
      this.user = user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurar token padrão para futuras requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { user, token };
    } catch (error: any) {
      throw new Error(error.response?.data?.erro || 'Erro ao fazer login');
    }
  }

  async loginAdmin(email: string, senha: string): Promise<{ user: AuthUser; token: string }> {
    const result = await this.login(email, senha);
    
    if (result.user.role !== 'admin') {
      this.logout();
      throw new Error('Acesso negado. Apenas administradores podem acessar esta área.');
    }
    
    return result;
  }

  async register(userData: {
    nome: string;
    email: string;
    senha: string;
    role?: 'empresa' | 'usuario';
    empresaId?: string;
  }): Promise<{ user: AuthUser }> {
    try {
      const response = await axios.post(`${API_URL}/auth/registrar`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.erro || 'Erro ao criar usuário');
    }
  }

  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      if (response.data.valid) {
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      }
      
      this.logout();
      return false;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  isEmpresa(): boolean {
    return this.user?.role === 'empresa';
  }

  getUserEmpresaId(): string | null {
    return this.user?.empresaId || null;
  }
}

export const authService = new AuthService();

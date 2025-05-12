
import axios from 'axios';

// Utiliza a variável de ambiente como URL da API ou usa fallback para localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://mock-api.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Erro de conexão com a API:', error);
      // Simulando uma resposta para desenvolvimento quando não há API disponível
      if (error.config.url.includes('/clientes')) {
        return Promise.resolve({
          data: [
            { 
              id: '1',
              nome: 'Cliente de Teste',
              email: 'teste@example.com',
              telefone: '(11) 99999-9999',
              whatsapp: '(11) 99999-9999',
              endereco: 'Rua de Teste, 123',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '12345678'
            }
          ]
        });
      }
    }
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export default api;

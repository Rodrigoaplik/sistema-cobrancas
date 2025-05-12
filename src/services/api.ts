
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
      
      // Resposta simulada para clientes
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
      
      // Resposta simulada para cobranças
      if (error.config.url.includes('/cobrancas')) {
        if (error.config.url.includes('/clientes/') && error.config.url.includes('/cobrancas')) {
          // Lista de cobranças por cliente
          return Promise.resolve({
            data: [
              {
                id: '1',
                clienteId: '1',
                descricao: 'Fatura Mensal',
                valor: 199.90,
                dataVencimento: new Date().toISOString(),
                status: 'pendente',
                dataPagamento: null
              },
              {
                id: '2',
                clienteId: '1',
                descricao: 'Serviços Extras',
                valor: 150.00,
                dataVencimento: new Date(Date.now() - 86400000 * 5).toISOString(),
                status: 'atrasado',
                dataPagamento: null
              },
              {
                id: '3',
                clienteId: '1',
                descricao: 'Consultoria',
                valor: 300.00,
                dataVencimento: new Date(Date.now() - 86400000 * 10).toISOString(),
                status: 'pago',
                dataPagamento: new Date(Date.now() - 86400000 * 8).toISOString()
              }
            ]
          });
        }
      }
      
      // Resposta simulada para notificações
      if (error.config.url.includes('/notificacoes')) {
        if (error.config.url.includes('/enviar')) {
          return Promise.resolve({
            data: {
              success: true,
              message: 'Notificação enviada com sucesso (simulado)',
              linkPagamento: 'https://pagamento-simulado.com/pix/123'
            }
          });
        }
        
        if (error.config.url.includes('/verificar-vencimentos')) {
          return Promise.resolve({
            data: {
              notificacoes_a_vencer: [{ success: true, cobrancaId: '1', clienteId: '1' }],
              notificacoes_vencidas: []
            }
          });
        }
      }
      
      // Resposta simulada para pagamentos
      if (error.config.url.includes('/pagamentos')) {
        return Promise.resolve({
          data: {
            linkPagamento: 'https://pagamento-simulado.com/pix/123'
          }
        });
      }
    }
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export default api;

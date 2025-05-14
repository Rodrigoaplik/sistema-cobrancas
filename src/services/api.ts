
import axios from 'axios';

// Utiliza a variável de ambiente como URL da API ou usa fallback para localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        if (error.config.url.endsWith('/clientes')) {
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
        } else if (error.config.url.match(/\/clientes\/\w+$/)) {
          // Buscar cliente por ID
          return Promise.resolve({
            data: { 
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
          });
        }
      }
      
      // Resposta simulada para cobranças
      if (error.config.url.includes('/cobrancas')) {
        // Listar todas as cobranças
        if (error.config.url.endsWith('/cobrancas')) {
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
              }
            ]
          });
        }
        
        // Buscar uma cobrança específica por ID
        if (error.config.url.match(/\/cobrancas\/\w+$/)) {
          return Promise.resolve({
            data: {
              id: error.config.url.split('/').pop(),
              clienteId: '1',
              descricao: 'Fatura Mensal',
              valor: 199.90,
              dataVencimento: new Date().toISOString(),
              status: 'pendente',
              dataPagamento: null
            }
          });
        }
        
        // Listar cobranças por cliente
        if (error.config.url.includes('/clientes/') && error.config.url.includes('/cobrancas')) {
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
        
        // Criar cobrança
        if (error.config.method === 'post' && 
            error.config.url.includes('/clientes/') && 
            error.config.url.includes('/cobrancas')) {
          const data = JSON.parse(error.config.data);
          return Promise.resolve({
            data: {
              id: Math.random().toString(36).substring(7),
              clienteId: error.config.url.split('/')[2], // Extrai o ID do cliente da URL
              ...data,
            }
          });
        }
        
        // Atualizar cobrança
        if (error.config.method === 'put' && error.config.url.match(/\/cobrancas\/\w+$/)) {
          const data = JSON.parse(error.config.data);
          return Promise.resolve({
            data: {
              id: error.config.url.split('/').pop(),
              ...data,
            }
          });
        }
        
        // Excluir cobrança
        if (error.config.method === 'delete' && error.config.url.match(/\/cobrancas\/\w+$/)) {
          return Promise.resolve({
            data: { mensagem: 'Cobrança excluída com sucesso' }
          });
        }
        
        // Atualizar status
        if (error.config.method === 'patch' && error.config.url.match(/\/cobrancas\/\w+\/status$/)) {
          const data = JSON.parse(error.config.data);
          return Promise.resolve({
            data: {
              id: error.config.url.split('/')[2],
              ...data,
            }
          });
        }
        
        // Verificar cobranças vencidas
        if (error.config.url.includes('/verificar-vencidas')) {
          return Promise.resolve({
            data: {
              atualizadas: 2,
              message: 'Cobranças vencidas atualizadas com sucesso'
            }
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
      }
    }
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export default api;

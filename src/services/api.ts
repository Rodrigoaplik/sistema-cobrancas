
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

// Cache para simulação
const mockDb = {
  clientes: [
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
  ],
  cobrancas: [
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
};

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Erro de conexão com a API:', error);
      // Simulando uma resposta para desenvolvimento quando não há API disponível
      
      // Resposta simulada para clientes
      if (error.config.url.includes('/clientes')) {
        // Listar todos os clientes
        if (error.config.method === 'get' && error.config.url.endsWith('/clientes')) {
          return Promise.resolve({
            data: mockDb.clientes
          });
        }
        
        // Buscar cliente por ID
        if (error.config.method === 'get' && error.config.url.match(/\/clientes\/\w+$/)) {
          const clienteId = error.config.url.split('/').pop();
          const cliente = mockDb.clientes.find(c => c.id === clienteId);
          
          if (cliente) {
            return Promise.resolve({ data: cliente });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cliente não encontrado' }
              }
            });
          }
        }
        
        // Criar cliente
        if (error.config.method === 'post' && error.config.url.endsWith('/clientes')) {
          const novoCliente = JSON.parse(error.config.data);
          const id = Math.random().toString(36).substring(7);
          const clienteCriado = { id, ...novoCliente };
          
          mockDb.clientes.push(clienteCriado);
          
          return Promise.resolve({ data: clienteCriado });
        }
        
        // Atualizar cliente
        if (error.config.method === 'put' && error.config.url.match(/\/clientes\/\w+$/)) {
          const clienteId = error.config.url.split('/').pop();
          const index = mockDb.clientes.findIndex(c => c.id === clienteId);
          
          if (index !== -1) {
            const dadosAtualizados = JSON.parse(error.config.data);
            mockDb.clientes[index] = { ...mockDb.clientes[index], ...dadosAtualizados };
            return Promise.resolve({ data: mockDb.clientes[index] });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cliente não encontrado' }
              }
            });
          }
        }
        
        // Excluir cliente
        if (error.config.method === 'delete' && error.config.url.match(/\/clientes\/\w+$/)) {
          const clienteId = error.config.url.split('/').pop();
          const index = mockDb.clientes.findIndex(c => c.id === clienteId);
          
          if (index !== -1) {
            mockDb.clientes.splice(index, 1);
            // Também exclui as cobranças associadas
            mockDb.cobrancas = mockDb.cobrancas.filter(c => c.clienteId !== clienteId);
            
            return Promise.resolve({ data: { mensagem: 'Cliente excluído com sucesso' } });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cliente não encontrado' }
              }
            });
          }
        }
        
        // Notificação para cliente
        if (error.config.method === 'post' && error.config.url.match(/\/clientes\/\w+\/notificar$/)) {
          const clienteId = error.config.url.split('/')[2];
          const cliente = mockDb.clientes.find(c => c.id === clienteId);
          
          if (cliente) {
            return Promise.resolve({
              data: {
                success: true,
                message: 'Notificação enviada com sucesso (simulado)',
                linkPagamento: 'https://pagamento-simulado.com/pix/123'
              }
            });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cliente não encontrado' }
              }
            });
          }
        }
      }
      
      // Resposta simulada para cobranças
      if (error.config.url.includes('/cobrancas')) {
        // Listar todas as cobranças
        if (error.config.method === 'get' && error.config.url.endsWith('/cobrancas')) {
          return Promise.resolve({
            data: mockDb.cobrancas
          });
        }
        
        // Buscar uma cobrança específica por ID
        if (error.config.method === 'get' && error.config.url.match(/\/cobrancas\/\w+$/)) {
          const cobrancaId = error.config.url.split('/').pop();
          const cobranca = mockDb.cobrancas.find(c => c.id === cobrancaId);
          
          if (cobranca) {
            return Promise.resolve({ data: cobranca });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cobrança não encontrada' }
              }
            });
          }
        }
        
        // Listar cobranças por cliente
        if (error.config.method === 'get' && error.config.url.includes('/clientes/') && error.config.url.includes('/cobrancas')) {
          const clienteId = error.config.url.split('/')[3];
          const cobrancasDoCliente = mockDb.cobrancas.filter(c => c.clienteId === clienteId);
          
          return Promise.resolve({ data: cobrancasDoCliente });
        }
        
        // Criar cobrança
        if (error.config.method === 'post' && 
            error.config.url.includes('/clientes/') && 
            error.config.url.includes('/cobrancas')) {
          const clienteId = error.config.url.split('/')[3];
          const cliente = mockDb.clientes.find(c => c.id === clienteId);
          
          if (!cliente) {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cliente não encontrado' }
              }
            });
          }
          
          const novaCobranca = JSON.parse(error.config.data);
          const cobrancaId = Math.random().toString(36).substring(7);
          
          const cobrancaCriada = {
            id: cobrancaId,
            clienteId,
            descricao: novaCobranca.descricao,
            valor: novaCobranca.valor,
            dataVencimento: novaCobranca.dataVencimento,
            status: novaCobranca.status || 'pendente',
            dataPagamento: novaCobranca.dataPagamento || null
          };
          
          mockDb.cobrancas.push(cobrancaCriada);
          
          return Promise.resolve({ data: cobrancaCriada });
        }
        
        // Atualizar cobrança
        if (error.config.method === 'put' && error.config.url.match(/\/cobrancas\/\w+$/)) {
          const cobrancaId = error.config.url.split('/').pop();
          const index = mockDb.cobrancas.findIndex(c => c.id === cobrancaId);
          
          if (index !== -1) {
            const dadosAtualizados = JSON.parse(error.config.data);
            mockDb.cobrancas[index] = { ...mockDb.cobrancas[index], ...dadosAtualizados };
            return Promise.resolve({ data: mockDb.cobrancas[index] });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cobrança não encontrada' }
              }
            });
          }
        }
        
        // Excluir cobrança
        if (error.config.method === 'delete' && error.config.url.match(/\/cobrancas\/\w+$/)) {
          const cobrancaId = error.config.url.split('/').pop();
          const index = mockDb.cobrancas.findIndex(c => c.id === cobrancaId);
          
          if (index !== -1) {
            mockDb.cobrancas.splice(index, 1);
            return Promise.resolve({ data: { mensagem: 'Cobrança excluída com sucesso' } });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cobrança não encontrada' }
              }
            });
          }
        }
        
        // Atualizar status
        if (error.config.method === 'patch' && error.config.url.match(/\/cobrancas\/\w+\/status$/)) {
          const cobrancaId = error.config.url.split('/')[2];
          const index = mockDb.cobrancas.findIndex(c => c.id === cobrancaId);
          
          if (index !== -1) {
            const { status, dataPagamento } = JSON.parse(error.config.data);
            mockDb.cobrancas[index].status = status;
            mockDb.cobrancas[index].dataPagamento = dataPagamento;
            
            return Promise.resolve({ data: mockDb.cobrancas[index] });
          } else {
            return Promise.reject({
              response: {
                status: 404,
                data: { erro: 'Cobrança não encontrada' }
              }
            });
          }
        }
        
        // Verificar cobranças vencidas
        if (error.config.url.includes('/verificar-vencidas')) {
          const hoje = new Date();
          let atualizadas = 0;
          
          mockDb.cobrancas.forEach(cobranca => {
            const dataVencimento = new Date(cobranca.dataVencimento);
            if (dataVencimento < hoje && cobranca.status === 'pendente') {
              cobranca.status = 'atrasado';
              atualizadas++;
            }
          });
          
          return Promise.resolve({
            data: {
              atualizadas: atualizadas,
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

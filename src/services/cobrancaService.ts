
import api from './api';
import { Cobranca } from '@/types';

// Função auxiliar para formatar datas
const formatarCobrancaParaAPI = (cobranca: Cobranca) => {
  return {
    ...cobranca,
    dataVencimento: cobranca.dataVencimento instanceof Date 
      ? cobranca.dataVencimento.toISOString().split('T')[0] 
      : cobranca.dataVencimento,
    dataPagamento: cobranca.dataPagamento instanceof Date 
      ? cobranca.dataPagamento.toISOString().split('T')[0] 
      : cobranca.dataPagamento
  };
};

// Função auxiliar para formatar datas da API para o frontend
const formatarCobrancaDaAPI = (cobranca: any): Cobranca => {
  return {
    id: cobranca.id,
    clienteId: cobranca.clienteId,
    descricao: cobranca.descricao,
    valor: cobranca.valor,
    dataVencimento: new Date(cobranca.dataVencimento),
    status: cobranca.status as 'pendente' | 'pago' | 'atrasado',
    dataPagamento: cobranca.dataPagamento ? new Date(cobranca.dataPagamento) : undefined
  };
};

const cobrancaService = {
  // Listar cobranças por cliente
  listarCobrancasPorCliente: async (clienteId: string): Promise<Cobranca[]> => {
    const response = await api.get(`/clientes/${clienteId}/cobrancas`);
    return response.data.map(formatarCobrancaDaAPI);
  },

  // Buscar cobrança por ID
  buscarCobranca: async (id: string): Promise<Cobranca> => {
    const response = await api.get(`/cobrancas/${id}`);
    return formatarCobrancaDaAPI(response.data);
  },

  // Criar uma nova cobrança
  criarCobranca: async (clienteId: string, cobranca: Cobranca): Promise<Cobranca> => {
    const cobrancaFormatada = formatarCobrancaParaAPI(cobranca);
    const response = await api.post(`/clientes/${clienteId}/cobrancas`, cobrancaFormatada);
    return formatarCobrancaDaAPI(response.data);
  },

  // Atualizar uma cobrança existente
  atualizarCobranca: async (id: string, cobranca: Cobranca): Promise<Cobranca> => {
    const cobrancaFormatada = formatarCobrancaParaAPI(cobranca);
    const response = await api.put(`/cobrancas/${id}`, cobrancaFormatada);
    return formatarCobrancaDaAPI(response.data);
  },

  // Excluir uma cobrança
  excluirCobranca: async (id: string): Promise<void> => {
    await api.delete(`/cobrancas/${id}`);
  },

  // Atualizar status de uma cobrança
  atualizarStatus: async (id: string, status: 'pendente' | 'pago' | 'atrasado', dataPagamento?: Date): Promise<void> => {
    const data = {
      status,
      dataPagamento: dataPagamento instanceof Date 
        ? dataPagamento.toISOString().split('T')[0] 
        : dataPagamento
    };
    await api.patch(`/cobrancas/${id}/status`, data);
  }
};

export default cobrancaService;

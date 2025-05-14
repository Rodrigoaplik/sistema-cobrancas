
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
  // Verificar se as datas são válidas
  let dataVencimento: Date;
  try {
    dataVencimento = new Date(cobranca.dataVencimento);
    if (isNaN(dataVencimento.getTime())) {
      console.warn("Data de vencimento inválida:", cobranca.dataVencimento);
      dataVencimento = new Date(); // Usar data atual como fallback
    }
  } catch (e) {
    console.warn("Erro ao converter data de vencimento:", e);
    dataVencimento = new Date(); // Usar data atual como fallback
  }

  let dataPagamento: Date | undefined = undefined;
  if (cobranca.dataPagamento) {
    try {
      dataPagamento = new Date(cobranca.dataPagamento);
      if (isNaN(dataPagamento.getTime())) {
        console.warn("Data de pagamento inválida:", cobranca.dataPagamento);
        dataPagamento = undefined;
      }
    } catch (e) {
      console.warn("Erro ao converter data de pagamento:", e);
      dataPagamento = undefined;
    }
  }

  return {
    id: cobranca.id,
    clienteId: cobranca.clienteId || cobranca.cliente_id,
    descricao: cobranca.descricao,
    valor: cobranca.valor,
    dataVencimento: dataVencimento,
    status: cobranca.status as 'pendente' | 'pago' | 'atrasado',
    dataPagamento: dataPagamento
  };
};

const cobrancaService = {
  // Listar todas as cobranças
  listarCobrancas: async (): Promise<Cobranca[]> => {
    const response = await api.get('/cobrancas');
    return response.data.map(formatarCobrancaDaAPI);
  },

  // Listar cobranças por cliente
  listarCobrancasPorCliente: async (clienteId: string): Promise<Cobranca[]> => {
    const response = await api.get(`/cobrancas/clientes/${clienteId}/cobrancas`);
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
    const response = await api.post(`/cobrancas/clientes/${clienteId}/cobrancas`, cobrancaFormatada);
    return formatarCobrancaDaAPI(response.data);
  },

  // Atualizar uma cobrança existente
  atualizarCobranca: async (id: string, cobranca: Cobranca): Promise<Cobranca> => {
    try {
      const cobrancaFormatada = formatarCobrancaParaAPI(cobranca);
      const response = await api.put(`/cobrancas/${id}`, cobrancaFormatada);
      return formatarCobrancaDaAPI(response.data);
    } catch (error) {
      console.error(`Erro ao atualizar cobrança: ${error}`);
      throw error;
    }
  },

  // Excluir uma cobrança
  excluirCobranca: async (id: string): Promise<void> => {
    try {
      await api.delete(`/cobrancas/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir cobrança: ${error}`);
      throw error;
    }
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
  },
  
  // Verificar cobranças vencidas
  verificarCobrancasVencidas: async (): Promise<any> => {
    const response = await api.post('/cobrancas/verificar-vencidas');
    return response.data;
  }
};

export default cobrancaService;

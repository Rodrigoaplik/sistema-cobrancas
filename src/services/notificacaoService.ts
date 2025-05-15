
import api from './api';

interface NotificacaoParams {
  clienteId: string;
  cobrancaId?: string;
  tipo: string;
  mensagem: string;
  assunto?: string;
}

interface NotificacaoResponse {
  success: boolean;
  message: string;
  linkPagamento?: string;
}

const notificacaoService = {
  // Enviar lembrete de vencimento para cliente
  enviarLembreteVencimento: async (clienteId: string, cobrancaId: string): Promise<NotificacaoResponse> => {
    try {
      const response = await api.post(`/notificacoes/lembrete/${clienteId}/${cobrancaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar lembrete de vencimento:', error);
      throw error;
    }
  },

  // Enviar notificação de cobrança vencida
  enviarNotificacaoVencimento: async (clienteId: string, cobrancaId: string): Promise<NotificacaoResponse> => {
    try {
      const response = await api.post(`/notificacoes/vencimento/${clienteId}/${cobrancaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar notificação de vencimento:', error);
      throw error;
    }
  },
  
  // Enviar notificação manual (personalizada pelo usuário)
  enviarNotificacaoManual: async (params: NotificacaoParams): Promise<NotificacaoResponse> => {
    try {
      const response = await api.post(`/clientes/${params.clienteId}/notificar`, params);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar notificação manual:', error);
      throw error;
    }
  }
};

export default notificacaoService;

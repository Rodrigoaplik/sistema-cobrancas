
import api from './api';

// Interface para opções de notificação
export interface NotificacaoOptions {
  clienteId: string;
  cobrancaId: string;
  tipo: 'aviso_vencimento' | 'cobranca_vencida';
}

// Interface para resposta de notificação
export interface NotificacaoResponse {
  success: boolean;
  message: string;
  linkPagamento?: string;
}

const notificacaoService = {
  // Enviar notificação ao cliente (via WhatsApp e/ou e-mail)
  enviarNotificacao: async (options: NotificacaoOptions): Promise<NotificacaoResponse> => {
    try {
      const response = await api.post('/notificacoes/enviar', options);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  },

  // Gerar link de pagamento
  gerarLinkPagamento: async (cobrancaId: string, metodoPagamento: 'pix' | 'cartao'): Promise<string> => {
    try {
      const response = await api.post(`/pagamentos/gerar-link`, {
        cobrancaId,
        metodoPagamento
      });
      return response.data.linkPagamento;
    } catch (error) {
      console.error('Erro ao gerar link de pagamento:', error);
      throw error;
    }
  },

  // Verificar cobranças prestes a vencer para notificação automática
  verificarCobrancasParaNotificar: async (): Promise<void> => {
    try {
      await api.post('/notificacoes/verificar-vencimentos');
    } catch (error) {
      console.error('Erro ao verificar cobranças para notificação:', error);
      throw error;
    }
  }
};

export default notificacaoService;

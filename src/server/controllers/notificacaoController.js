
const comunicacaoService = require('../services/comunicacaoService');
const clienteModel = require('../models/clienteModel');
const cobrancaModel = require('../models/cobrancaModel');

class NotificacaoController {
  // Enviar notificação genérica
  async enviarNotificacao(req, res) {
    try {
      const { clienteId, cobrancaId, tipo, mensagem, assunto } = req.body;
      
      if (!clienteId) {
        return res.status(400).json({ erro: 'ID do cliente é obrigatório' });
      }
      
      // Verificar se o cliente existe e pertence à empresa
      const cliente = await clienteModel.findById(clienteId, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      // Se há cobrancaId, verificar se a cobrança existe
      let cobranca = null;
      if (cobrancaId) {
        cobranca = await cobrancaModel.findById(cobrancaId, req.user.role === 'admin' ? null : req.user.empresaId);
        if (!cobranca) {
          return res.status(404).json({ erro: 'Cobrança não encontrada' });
        }
      }
      
      // Enviar notificação
      const resultado = await comunicacaoService.enviarNotificacao({
        cliente,
        cobranca,
        tipo: tipo || 'geral',
        mensagem: mensagem || 'Notificação do sistema',
        assunto: assunto || 'Sistema de Cobranças'
      });
      
      res.json(resultado);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao enviar notificação',
        mensagem: error.message
      });
    }
  }

  // Enviar lembrete de vencimento
  async enviarLembreteVencimento(req, res) {
    try {
      const { clienteId, cobrancaId } = req.params;
      
      // Verificar se o cliente existe
      const cliente = await clienteModel.findById(clienteId, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      // Verificar se a cobrança existe
      const cobranca = await cobrancaModel.findById(cobrancaId, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cobranca) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }
      
      // Enviar lembrete
      const resultado = await comunicacaoService.enviarLembreteVencimento(cliente, cobranca);
      
      res.json(resultado);
    } catch (error) {
      console.error('Erro ao enviar lembrete de vencimento:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao enviar lembrete',
        mensagem: error.message
      });
    }
  }

  // Enviar notificação de cobrança vencida
  async enviarNotificacaoVencimento(req, res) {
    try {
      const { clienteId, cobrancaId } = req.params;
      
      // Verificar se o cliente existe
      const cliente = await clienteModel.findById(clienteId, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      // Verificar se a cobrança existe
      const cobranca = await cobrancaModel.findById(cobrancaId, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cobranca) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }
      
      // Enviar notificação de vencimento
      const resultado = await comunicacaoService.enviarNotificacaoVencimento(cliente, cobranca);
      
      res.json(resultado);
    } catch (error) {
      console.error('Erro ao enviar notificação de vencimento:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao enviar notificação',
        mensagem: error.message
      });
    }
  }
}

module.exports = new NotificacaoController();

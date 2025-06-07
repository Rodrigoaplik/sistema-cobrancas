
const cobrancaModel = require('../models/cobrancaModel');
const clienteModel = require('../models/clienteModel');
const { sendWhatsApp, sendEmail } = require('../services/comunicacaoService');
const pagamentoService = require('../services/pagamentoService');

class NotificacaoController {
  // Enviar notificação via WhatsApp e Email
  async enviarNotificacao(req, res) {
    try {
      const { clienteId, cobrancaId, tipo } = req.body;
      
      // Buscar dados do cliente e cobrança
      const cliente = await clienteModel.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      const cobranca = await cobrancaModel.findById(cobrancaId);
      if (!cobranca) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }
      
      // Preparar dados para a mensagem
      const dadosNotificacao = {
        nomeCliente: cliente.nome,
        valorCobranca: cobranca.valor,
        dataVencimento: cobranca.data_vencimento,
        descricaoCobranca: cobranca.descricao,
        linkPagamentoPix: await pagamentoService.gerarLinkPagamento(cobrancaId, 'pix'),
        linkPagamentoCartao: await pagamentoService.gerarLinkPagamento(cobrancaId, 'cartao')
      };
      
      // Escolher template baseado no tipo de notificação
      let templateWhatsApp, assuntoEmail, templateEmail;
      
      if (tipo === 'aviso_vencimento') {
        templateWhatsApp = `Olá ${dadosNotificacao.nomeCliente}, sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} vence em breve (${dadosNotificacao.dataVencimento}). Para pagar via PIX, acesse: ${dadosNotificacao.linkPagamentoPix} ou via cartão: ${dadosNotificacao.linkPagamentoCartao}`;
        assuntoEmail = "Lembrete de Cobrança a Vencer";
        templateEmail = `<p>Prezado(a) ${dadosNotificacao.nomeCliente},</p><p>Este é um lembrete de que sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} vencerá em ${dadosNotificacao.dataVencimento}.</p><p>Escolha uma opção de pagamento:</p><ul><li><a href="${dadosNotificacao.linkPagamentoPix}">Pagar via PIX</a></li><li><a href="${dadosNotificacao.linkPagamentoCartao}">Pagar via Cartão de Crédito</a></li></ul><p>Obrigado!</p>`;
      } else {
        templateWhatsApp = `ATENÇÃO ${dadosNotificacao.nomeCliente}, sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} está VENCIDA desde ${dadosNotificacao.dataVencimento}. Regularize agora via PIX: ${dadosNotificacao.linkPagamentoPix} ou cartão: ${dadosNotificacao.linkPagamentoCartao}`;
        assuntoEmail = "URGENTE: Cobrança Vencida";
        templateEmail = `<p>Prezado(a) ${dadosNotificacao.nomeCliente},</p><p>Informamos que sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} está <strong>vencida</strong> desde ${dadosNotificacao.dataVencimento}.</p><p>Para evitar juros adicionais, regularize sua situação agora mesmo:</p><ul><li><a href="${dadosNotificacao.linkPagamentoPix}">Pagar via PIX</a></li><li><a href="${dadosNotificacao.linkPagamentoCartao}">Pagar via Cartão de Crédito</a></li></ul><p>Em caso de dúvidas, entre em contato conosco.</p>`;
      }
      
      // Enviar notificações
      const resultadoWhatsApp = await sendWhatsApp(cliente.whatsapp, templateWhatsApp);
      const resultadoEmail = await sendEmail(cliente.email, assuntoEmail, templateEmail);
      
      res.status(200).json({
        success: true,
        message: 'Notificações enviadas com sucesso',
        whatsapp: resultadoWhatsApp,
        email: resultadoEmail,
        linkPagamentoPix: dadosNotificacao.linkPagamentoPix,
        linkPagamentoCartao: dadosNotificacao.linkPagamentoCartao
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao enviar notificação',
        mensagem: error.message
      });
    }
  }
  
  // Verificar cobranças que estão prestes a vencer (3 dias antes) ou vencidas para notificação automática
  async verificarVencimentos(req, res) {
    try {
      const hoje = new Date();
      
      // Data de 3 dias à frente para verificar vencimentos próximos
      const dataLimiteAviso = new Date();
      dataLimiteAviso.setDate(hoje.getDate() + 3);
      const dataAvisoFormatada = dataLimiteAviso.toISOString().split('T')[0];
      
      // Buscar cobranças prestes a vencer (exatamente em 3 dias)
      const cobrancasAVencer = await cobrancaModel.findByVencimentoData(dataAvisoFormatada);
      
      // Buscar cobranças vencidas recentemente (1 dia atrás) e não notificadas
      const ontem = new Date();
      ontem.setDate(hoje.getDate() - 1);
      const dataOntemFormatada = ontem.toISOString().split('T')[0];
      const cobrancasVencidas = await cobrancaModel.findByVencimentoData(dataOntemFormatada, 'pendente');
      
      // Processar notificações de cobranças a vencer
      const notificacoesAVencer = await Promise.all(cobrancasAVencer.map(async (cobranca) => {
        try {
          const cliente = await clienteModel.findById(cobranca.cliente_id);
          if (!cliente) return { error: `Cliente não encontrado: ${cobranca.cliente_id}`, cobrancaId: cobranca.id };
          
          // Enviar notificação de aviso
          await this._enviarNotificacaoDireta(cliente, cobranca, 'aviso_vencimento');
          return { 
            success: true, 
            cobrancaId: cobranca.id, 
            clienteId: cliente.id, 
            tipo: 'aviso_vencimento' 
          };
        } catch (err) {
          console.error(`Erro ao notificar vencimento para cobrança ${cobranca.id}:`, err);
          return { error: err.message, cobrancaId: cobranca.id };
        }
      }));
      
      // Processar notificações de cobranças vencidas
      const notificacoesVencidas = await Promise.all(cobrancasVencidas.map(async (cobranca) => {
        try {
          const cliente = await clienteModel.findById(cobranca.cliente_id);
          if (!cliente) return { error: `Cliente não encontrado: ${cobranca.cliente_id}`, cobrancaId: cobranca.id };
          
          // Atualizar status da cobrança para "atrasado"
          await cobrancaModel.updateStatus(cobranca.id, 'atrasado');
          
          // Enviar notificação de cobrança vencida
          await this._enviarNotificacaoDireta(cliente, cobranca, 'cobranca_vencida');
          return { 
            success: true, 
            cobrancaId: cobranca.id, 
            clienteId: cliente.id, 
            tipo: 'cobranca_vencida' 
          };
        } catch (err) {
          console.error(`Erro ao notificar atraso para cobrança ${cobranca.id}:`, err);
          return { error: err.message, cobrancaId: cobranca.id };
        }
      }));
      
      res.status(200).json({
        notificacoes_a_vencer: notificacoesAVencer,
        notificacoes_vencidas: notificacoesVencidas
      });
    } catch (error) {
      console.error('Erro ao verificar vencimentos:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao verificar vencimentos',
        mensagem: error.message
      });
    }
  }
  
  // Método auxiliar para enviar notificações diretamente
  async _enviarNotificacaoDireta(cliente, cobranca, tipo) {
    // Preparar dados para a mensagem
    const dadosNotificacao = {
      nomeCliente: cliente.nome,
      valorCobranca: cobranca.valor,
      dataVencimento: cobranca.data_vencimento,
      descricaoCobranca: cobranca.descricao,
      linkPagamentoPix: await pagamentoService.gerarLinkPagamento(cobranca.id, 'pix'),
      linkPagamentoCartao: await pagamentoService.gerarLinkPagamento(cobranca.id, 'cartao')
    };
    
    // Escolher template baseado no tipo de notificação
    let templateWhatsApp, assuntoEmail, templateEmail;
    
    if (tipo === 'aviso_vencimento') {
      templateWhatsApp = `Olá ${dadosNotificacao.nomeCliente}, sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} vence em breve (${dadosNotificacao.dataVencimento}). Para pagar via PIX, acesse: ${dadosNotificacao.linkPagamentoPix} ou via cartão: ${dadosNotificacao.linkPagamentoCartao}`;
      assuntoEmail = "Lembrete de Cobrança a Vencer";
      templateEmail = `<p>Prezado(a) ${dadosNotificacao.nomeCliente},</p><p>Este é um lembrete de que sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} vencerá em ${dadosNotificacao.dataVencimento}.</p><p>Escolha uma opção de pagamento:</p><ul><li><a href="${dadosNotificacao.linkPagamentoPix}">Pagar via PIX</a></li><li><a href="${dadosNotificacao.linkPagamentoCartao}">Pagar via Cartão de Crédito</a></li></ul><p>Obrigado!</p>`;
    } else {
      templateWhatsApp = `ATENÇÃO ${dadosNotificacao.nomeCliente}, sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} está VENCIDA desde ${dadosNotificacao.dataVencimento}. Regularize agora via PIX: ${dadosNotificacao.linkPagamentoPix} ou cartão: ${dadosNotificacao.linkPagamentoCartao}`;
      assuntoEmail = "URGENTE: Cobrança Vencida";
      templateEmail = `<p>Prezado(a) ${dadosNotificacao.nomeCliente},</p><p>Informamos que sua cobrança de ${dadosNotificacao.descricaoCobranca} no valor de R$ ${dadosNotificacao.valorCobranca} está <strong>vencida</strong> desde ${dadosNotificacao.dataVencimento}.</p><p>Para evitar juros adicionais, regularize sua situação agora mesmo:</p><ul><li><a href="${dadosNotificacao.linkPagamentoPix}">Pagar via PIX</a></li><li><a href="${dadosNotificacao.linkPagamentoCartao}">Pagar via Cartão de Crédito</a></li></ul><p>Em caso de dúvidas, entre em contato conosco.</p>`;
    }
    
    // Enviar notificações
    await sendWhatsApp(cliente.whatsapp, templateWhatsApp);
    await sendEmail(cliente.email, assuntoEmail, templateEmail);
    
    return true;
  }
  
  // Enviar notificação manual de cobrança
  async enviarNotificacaoManual(req, res) {
    try {
      const { clienteId, cobrancaId } = req.body;
      
      // Buscar dados do cliente e cobrança
      const cliente = await clienteModel.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      const cobranca = await cobrancaModel.findById(cobrancaId);
      if (!cobranca) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }
      
      // Tipo de notificação com base no status da cobrança
      const tipo = cobranca.status === 'atrasado' ? 'cobranca_vencida' : 'aviso_vencimento';
      
      // Enviar notificação
      await this._enviarNotificacaoDireta(cliente, cobranca, tipo);
      
      res.status(200).json({ 
        success: true, 
        message: 'Notificação enviada manualmente com sucesso' 
      });
    } catch (error) {
      console.error('Erro ao enviar notificação manual:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao enviar notificação manual',
        mensagem: error.message
      });
    }
  }
}

module.exports = new NotificacaoController();

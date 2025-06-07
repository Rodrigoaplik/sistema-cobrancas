
class ComunicacaoService {
  // Enviar notificação genérica
  async enviarNotificacao({ cliente, cobranca, tipo, mensagem, assunto }) {
    try {
      console.log(`Enviando notificação para ${cliente.nome} (${cliente.email})`);
      console.log(`Tipo: ${tipo}`);
      console.log(`Assunto: ${assunto}`);
      console.log(`Mensagem: ${mensagem}`);
      
      // Aqui seria a integração real com serviços de email/SMS/WhatsApp
      // Por enquanto, simulamos o envio
      
      const resultado = {
        success: true,
        message: 'Notificação enviada com sucesso',
        cliente: cliente.nome,
        email: cliente.email,
        tipo: tipo,
        timestamp: new Date().toISOString()
      };
      
      if (cobranca) {
        resultado.cobranca = {
          id: cobranca.id,
          descricao: cobranca.descricao,
          valor: cobranca.valor,
          dataVencimento: cobranca.data_vencimento
        };
        
        // Gerar link de pagamento simulado
        resultado.linkPagamento = `https://pagamento-simulado.com/pix/${cobranca.id}`;
      }
      
      return resultado;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }

  // Enviar lembrete de vencimento
  async enviarLembreteVencimento(cliente, cobranca) {
    const dataVencimento = new Date(cobranca.data_vencimento);
    const hoje = new Date();
    const diasParaVencimento = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
    
    let mensagem;
    if (diasParaVencimento > 0) {
      mensagem = `Olá ${cliente.nome}! Sua cobrança "${cobranca.descricao}" no valor de R$ ${cobranca.valor.toFixed(2)} vence em ${diasParaVencimento} dias (${dataVencimento.toLocaleDateString('pt-BR')}).`;
    } else if (diasParaVencimento === 0) {
      mensagem = `Olá ${cliente.nome}! Sua cobrança "${cobranca.descricao}" no valor de R$ ${cobranca.valor.toFixed(2)} vence HOJE!`;
    } else {
      mensagem = `Olá ${cliente.nome}! Sua cobrança "${cobranca.descricao}" no valor de R$ ${cobranca.valor.toFixed(2)} venceu há ${Math.abs(diasParaVencimento)} dias.`;
    }
    
    return await this.enviarNotificacao({
      cliente,
      cobranca,
      tipo: 'lembrete_vencimento',
      mensagem,
      assunto: 'Lembrete de Vencimento - Sistema de Cobranças'
    });
  }

  // Enviar notificação de cobrança vencida
  async enviarNotificacaoVencimento(cliente, cobranca) {
    const dataVencimento = new Date(cobranca.data_vencimento);
    const hoje = new Date();
    const diasVencidos = Math.ceil((hoje - dataVencimento) / (1000 * 60 * 60 * 24));
    
    const mensagem = `Olá ${cliente.nome}! Sua cobrança "${cobranca.descricao}" no valor de R$ ${cobranca.valor.toFixed(2)} está vencida há ${diasVencidos} dias. Por favor, regularize sua situação o quanto antes.`;
    
    return await this.enviarNotificacao({
      cliente,
      cobranca,
      tipo: 'cobranca_vencida',
      mensagem,
      assunto: 'Cobrança Vencida - Sistema de Cobranças'
    });
  }

  // Enviar confirmação de pagamento
  async enviarConfirmacaoPagamento(cliente, cobranca) {
    const mensagem = `Olá ${cliente.nome}! Confirmamos o recebimento do pagamento da cobrança "${cobranca.descricao}" no valor de R$ ${cobranca.valor.toFixed(2)}. Obrigado!`;
    
    return await this.enviarNotificacao({
      cliente,
      cobranca,
      tipo: 'confirmacao_pagamento',
      mensagem,
      assunto: 'Pagamento Confirmado - Sistema de Cobranças'
    });
  }
}

module.exports = new ComunicacaoService();

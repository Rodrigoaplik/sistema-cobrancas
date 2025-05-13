
const cobrancaModel = require('../../models/cobrancaModel');

// Atualizar uma cobrança existente
async function atualizarCobranca(req, res) {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    
    // Verificar se a cobrança existe
    const cobrancaExistente = await cobrancaModel.findById(id);
    if (!cobrancaExistente) {
      return res.status(404).json({ erro: 'Cobrança não encontrada' });
    }
    
    // Validações básicas
    if (!dadosAtualizados.descricao || !dadosAtualizados.valor || !dadosAtualizados.dataVencimento) {
      return res.status(400).json({ erro: 'Descrição, valor e data de vencimento são obrigatórios' });
    }
    
    // Manter o cliente_id original
    const cobrancaParaAtualizar = {
      clienteId: cobrancaExistente.cliente_id,
      descricao: dadosAtualizados.descricao,
      valor: dadosAtualizados.valor,
      dataVencimento: dadosAtualizados.dataVencimento,
      status: dadosAtualizados.status || cobrancaExistente.status,
      dataPagamento: dadosAtualizados.dataPagamento
    };
    
    const cobrancaAtualizada = await cobrancaModel.update(id, cobrancaParaAtualizar);
    res.status(200).json(cobrancaAtualizada);
  } catch (error) {
    console.error(`Erro ao atualizar cobrança com ID ${req.params.id}:`, error);
    res.status(500).json({
      erro: 'Erro interno do servidor ao atualizar cobrança',
      mensagem: error.message
    });
  }
}

// Atualizar status de uma cobrança
async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, dataPagamento } = req.body;
    
    // Validação do status
    if (!['pendente', 'pago', 'atrasado'].includes(status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }
    
    const resultado = await cobrancaModel.updateStatus(id, status, dataPagamento);
    res.status(200).json(resultado);
  } catch (error) {
    if (error.message === 'Cobrança não encontrada') {
      return res.status(404).json({ erro: error.message });
    }
    
    console.error(`Erro ao atualizar status da cobrança com ID ${req.params.id}:`, error);
    res.status(500).json({
      erro: 'Erro interno do servidor ao atualizar status da cobrança',
      mensagem: error.message
    });
  }
}

module.exports = {
  atualizarCobranca,
  atualizarStatus
};

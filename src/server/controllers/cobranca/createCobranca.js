
const cobrancaModel = require('../../models/cobrancaModel');
const clienteModel = require('../../models/clienteModel');

// Criar uma nova cobrança
async function criarCobranca(req, res) {
  try {
    const { clienteId } = req.params;
    const novaCobranca = req.body;
    
    // Verificar se o cliente existe
    const cliente = await clienteModel.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    
    // Validações básicas
    if (!novaCobranca.descricao || !novaCobranca.valor || !novaCobranca.dataVencimento) {
      return res.status(400).json({ erro: 'Descrição, valor e data de vencimento são obrigatórios' });
    }
    
    // Formatação para o banco
    const cobrancaParaBanco = {
      clienteId: clienteId,
      descricao: novaCobranca.descricao,
      valor: novaCobranca.valor,
      dataVencimento: novaCobranca.dataVencimento,
      status: novaCobranca.status || 'pendente',
      dataPagamento: novaCobranca.dataPagamento || null
    };
    
    const cobrancaCriada = await cobrancaModel.create(cobrancaParaBanco);
    res.status(201).json(cobrancaCriada);
  } catch (error) {
    console.error('Erro ao criar cobrança:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor ao criar cobrança',
      mensagem: error.message
    });
  }
}

module.exports = {
  criarCobranca
};

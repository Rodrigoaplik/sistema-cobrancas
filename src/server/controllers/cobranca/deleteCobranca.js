
const cobrancaModel = require('../../models/cobrancaModel');

// Excluir uma cobrança
async function excluirCobranca(req, res) {
  try {
    const { id } = req.params;
    await cobrancaModel.delete(id);
    res.status(200).json({ mensagem: 'Cobrança excluída com sucesso' });
  } catch (error) {
    if (error.message === 'Cobrança não encontrada') {
      return res.status(404).json({ erro: error.message });
    }
    
    console.error(`Erro ao excluir cobrança com ID ${req.params.id}:`, error);
    res.status(500).json({
      erro: 'Erro interno do servidor ao excluir cobrança',
      mensagem: error.message
    });
  }
}

module.exports = {
  excluirCobranca
};


const cobrancaModel = require('../../models/cobrancaModel');

// Verificar cobranças vencidas
async function verificarCobrancasVencidas(req, res) {
  try {
    const resultado = await cobrancaModel.verificarCobrancasVencidas();
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao verificar cobranças vencidas:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor ao verificar cobranças vencidas',
      mensagem: error.message
    });
  }
}

module.exports = {
  verificarCobrancasVencidas
};


const cobrancaModel = require('../../models/cobrancaModel');

// Verificar cobranças vencidas
async function verificarCobrancasVencidas(req, res) {
  try {
    console.log('Iniciando verificação de cobranças vencidas...');
    const resultado = await cobrancaModel.verificarCobrancasVencidas();
    console.log('Verificação concluída:', resultado);
    
    res.status(200).json({
      ...resultado,
      mensagem: `${resultado.atualizadas} cobrança(s) atualizada(s) para status 'atrasado'`
    });
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

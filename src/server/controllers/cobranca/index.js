
const { listarCobrancas, listarCobrancasPorCliente, buscarCobranca } = require('./getCobrancas');
const { criarCobranca } = require('./createCobranca');
const { atualizarCobranca, atualizarStatus } = require('./updateCobranca');
const { excluirCobranca } = require('./deleteCobranca');
const { verificarCobrancasVencidas } = require('./verificarVencidas');

module.exports = {
  listarCobrancas,
  listarCobrancasPorCliente,
  buscarCobranca,
  criarCobranca,
  atualizarCobranca,
  excluirCobranca,
  atualizarStatus,
  verificarCobrancasVencidas
};

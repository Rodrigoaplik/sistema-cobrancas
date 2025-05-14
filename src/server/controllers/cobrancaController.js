
const { listarCobrancas, listarCobrancasPorCliente, buscarCobranca } = require('./cobranca/getCobrancas');
const { criarCobranca } = require('./cobranca/createCobranca');
const { atualizarCobranca, atualizarStatus } = require('./cobranca/updateCobranca');
const { excluirCobranca } = require('./cobranca/deleteCobranca');
const { verificarCobrancasVencidas } = require('./cobranca/verificarVencidas');

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

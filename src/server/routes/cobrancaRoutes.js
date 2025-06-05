
const express = require('express');
const cobrancaController = require('../controllers/cobrancaController');

const router = express.Router();

// Rotas de cobranças
router.get('/', cobrancaController.listarCobrancas);
router.get('/:id', cobrancaController.buscarCobranca);
router.put('/:id', cobrancaController.atualizarCobranca);
router.delete('/:id', cobrancaController.excluirCobranca);
router.patch('/:id/status', cobrancaController.atualizarStatus);

// Rotas específicas por cliente
router.get('/clientes/:clienteId/cobrancas', cobrancaController.listarCobrancasPorCliente);
router.post('/clientes/:clienteId/cobrancas', cobrancaController.criarCobranca);

// Rota para verificar cobranças vencidas
router.post('/verificar-vencidas', cobrancaController.verificarCobrancasVencidas);

module.exports = router;

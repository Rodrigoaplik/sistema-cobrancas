
const express = require('express');
const cobrancaController = require('../controllers/cobrancaController');

const router = express.Router();

// Rotas para cobranças
router.get('/', cobrancaController.listarCobrancas);
router.get('/:id', cobrancaController.buscarCobranca);
router.put('/:id', cobrancaController.atualizarCobranca);
router.delete('/:id', cobrancaController.excluirCobranca);
router.patch('/:id/status', cobrancaController.atualizarStatus);
router.post('/verificar-vencidas', cobrancaController.verificarCobrancasVencidas);

// Rota para criar cobrança associada a um cliente
router.post('/clientes/:clienteId/cobrancas', cobrancaController.criarCobranca);
router.get('/clientes/:clienteId/cobrancas', cobrancaController.listarCobrancasPorCliente);

module.exports = router;

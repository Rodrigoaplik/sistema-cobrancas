
const express = require('express');
const clienteController = require('../controllers/clienteController');
const cobrancaController = require('../controllers/cobrancaController');

const router = express.Router();

// Rotas para cliente
router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.buscarCliente);
router.post('/', clienteController.criarCliente);
router.put('/:id', clienteController.atualizarCliente);
router.delete('/:id', clienteController.excluirCliente);

// Rotas para cobranças de um cliente específico
router.get('/:clienteId/cobrancas', cobrancaController.listarCobrancasPorCliente);
router.post('/:clienteId/cobrancas', cobrancaController.criarCobranca);

module.exports = router;

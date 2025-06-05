
const express = require('express');
const clienteController = require('../controllers/clienteController');

const router = express.Router();

// Rotas de clientes
router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.buscarCliente);
router.post('/', clienteController.criarCliente);
router.put('/:id', clienteController.atualizarCliente);
router.delete('/:id', clienteController.excluirCliente);

// Rota para notificar cliente
router.post('/:id/notificar', clienteController.notificarCliente);

module.exports = router;

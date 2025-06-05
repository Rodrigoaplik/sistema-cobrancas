
const express = require('express');
const empresaController = require('../controllers/empresaController');

const router = express.Router();

// Rotas de empresas (apenas admin)
router.get('/', empresaController.listarEmpresas);
router.get('/:id', empresaController.buscarEmpresa);
router.post('/', empresaController.criarEmpresa);
router.put('/:id', empresaController.atualizarEmpresa);
router.delete('/:id', empresaController.excluirEmpresa);
router.get('/stats/geral', empresaController.obterEstatisticas);

module.exports = router;

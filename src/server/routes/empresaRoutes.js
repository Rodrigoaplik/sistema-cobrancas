
const express = require('express');
const empresaController = require('../controllers/empresaController');
const { verificarToken, verificarRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas de empresa requerem autenticação
router.use(verificarToken);

// Apenas administradores podem acessar essas rotas
router.use(verificarRole(['admin']));

// Rotas para empresas
router.post('/', empresaController.createEmpresaWithUser.bind(empresaController));
router.get('/', empresaController.getAll.bind(empresaController));
router.get('/stats', empresaController.getStats.bind(empresaController));
router.get('/:id', empresaController.getById.bind(empresaController));
router.put('/:id', empresaController.update.bind(empresaController));

module.exports = router;

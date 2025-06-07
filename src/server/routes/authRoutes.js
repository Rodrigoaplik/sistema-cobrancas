
const express = require('express');
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.post('/login', authController.login.bind(authController));
router.post('/registrar', authController.registrar.bind(authController));

// Rotas protegidas
router.get('/verify', verificarToken, authController.verificarToken.bind(authController));

module.exports = router;

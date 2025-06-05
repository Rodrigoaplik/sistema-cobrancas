
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Rota de login
router.post('/login', authController.login);

// Rota de registro
router.post('/registrar', authController.registrar);

// Rota de verificação de token
router.get('/verify', authController.verificarToken);

module.exports = router;

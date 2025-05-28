
const express = require('express');
const clienteRoutes = require('./clienteRoutes');
const cobrancaRoutes = require('./cobrancaRoutes');
const notificacaoRoutes = require('./notificacaoRoutes');
const empresaRoutes = require('./empresaRoutes');
const authRoutes = require('./authRoutes');
const { verificarToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Middleware de autenticação para todas as rotas abaixo
router.use(verificarToken);

// Rotas protegidas
router.use('/clientes', clienteRoutes);
router.use('/cobrancas', cobrancaRoutes);
router.use('/notificacoes', notificacaoRoutes);
router.use('/empresas', empresaRoutes);

module.exports = router;

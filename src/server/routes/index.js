
const express = require('express');
const clienteRoutes = require('./clienteRoutes');
const cobrancaRoutes = require('./cobrancaRoutes');
const notificacaoRoutes = require('./notificacaoRoutes');

const router = express.Router();

// Rotas para recursos da API
router.use('/clientes', clienteRoutes);
router.use('/cobrancas', cobrancaRoutes);
router.use('/notificacoes', notificacaoRoutes);

// Rota de status
router.get('/status', (req, res) => {
  res.status(200).json({ status: 'API funcionando corretamente' });
});

module.exports = router;

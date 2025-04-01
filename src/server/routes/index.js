
const express = require('express');
const clienteRoutes = require('./clienteRoutes');
const cobrancaRoutes = require('./cobrancaRoutes');

const router = express.Router();

// Rota de verificação de saúde da API
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API funcionando corretamente' });
});

// Registrar rotas de clientes
router.use('/clientes', clienteRoutes);

// Registrar rotas de cobranças
router.use('/cobrancas', cobrancaRoutes);

module.exports = router;

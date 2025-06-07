
const express = require('express');
const notificacaoController = require('../controllers/notificacaoController');

const router = express.Router();

// Rota para enviar notificações genéricas
router.post('/enviar', notificacaoController.enviarNotificacao);

// Rota para enviar lembrete de vencimento
router.post('/lembrete/:clienteId/:cobrancaId', notificacaoController.enviarLembreteVencimento);

// Rota para enviar notificação de vencimento
router.post('/vencimento/:clienteId/:cobrancaId', notificacaoController.enviarNotificacaoVencimento);

module.exports = router;

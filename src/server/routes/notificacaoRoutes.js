
const express = require('express');
const notificacaoController = require('../controllers/notificacaoController');

const router = express.Router();

// Rota para enviar notificações
router.post('/enviar', notificacaoController.enviarNotificacao);

module.exports = router;

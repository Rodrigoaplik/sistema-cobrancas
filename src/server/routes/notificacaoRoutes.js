
const express = require('express');
const notificacaoController = require('../controllers/notificacaoController');

const router = express.Router();

// Rotas para notificações
router.post('/enviar', notificacaoController.enviarNotificacao.bind(notificacaoController));
router.post('/verificar-vencimentos', notificacaoController.verificarVencimentos.bind(notificacaoController));
router.post('/enviar-manual', notificacaoController.enviarNotificacaoManual.bind(notificacaoController));

module.exports = router;

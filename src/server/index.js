
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const routes = require('./routes');

// Iniciar servidor
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Habilita CORS para o frontend
app.use(express.json()); // Parseia requisições com JSON
app.use(express.urlencoded({ extended: true })); // Parseia requisições com formulários

// Verificar conexão com o banco de dados
testConnection();

// Configurar agendamento para verificar cobranças vencidas
const cobrancaModel = require('./models/cobrancaModel');
// Verificar cobranças vencidas ao iniciar o servidor
cobrancaModel.verificarCobranfasVencidas()
  .then(result => console.log(`Cobranças atualizadas ao iniciar: ${result.atualizadas}`))
  .catch(err => console.error('Erro ao verificar cobranças vencidas:', err));

// Agendar verificação diária (00:01)
const schedule = require('node-schedule');
schedule.scheduleJob('1 0 * * *', async function() {
  try {
    const result = await cobrancaModel.verificarCobranfasVencidas();
    console.log(`Cobranças atualizadas na verificação diária: ${result.atualizadas}`);
  } catch (error) {
    console.error('Erro na verificação diária de cobranças vencidas:', error);
  }
});

// Configurar rotas
app.use('/api', routes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Para testes

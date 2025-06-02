
const express = require('express');
const cors = require('cors');
const { testConnection, createDatabaseIfNotExists } = require('./config/database');
const routes = require('./routes');

// Inicializar servidor
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Função para inicializar o sistema
async function initializeSystem() {
  try {
    console.log('🚀 Iniciando Sistema de Cobranças...\n');
    
    // 1. Verificar/criar banco de dados
    await createDatabaseIfNotExists();
    
    // 2. Testar conexão
    await testConnection();
    
    // 3. Configurar agendamento para verificar cobranças vencidas
    const cobrancaModel = require('./models/cobrancaModel');
    const result = await cobrancaModel.verificarCobranfasVencidas();
    console.log(`📊 Cobranças atualizadas ao iniciar: ${result.atualizadas}`);

    // 4. Agendar verificação diária (00:01)
    const schedule = require('node-schedule');
    schedule.scheduleJob('1 0 * * *', async function() {
      try {
        const result = await cobrancaModel.verificarCobranfasVencidas();
        console.log(`📊 Verificação diária: ${result.atualizadas} cobranças atualizadas`);
      } catch (error) {
        console.error('❌ Erro na verificação diária:', error);
      }
    });

    console.log('✅ Sistema inicializado com sucesso!\n');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema:', error.message);
    process.exit(1);
  }
}

// Configurar rotas
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sistema de Cobranças API', 
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Inicializar sistema e servidor
initializeSystem().then(() => {
  app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando na porta ${PORT}`);
    console.log(`📍 API disponível em: http://localhost:${PORT}/api`);
    console.log(`🔗 Teste em: http://localhost:${PORT}\n`);
  });
});

module.exports = app;


const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../.env' });

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_cobrancas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z'
};

console.log('Configuração do banco:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? '***' : 'não definida'
});

// Criação do pool de conexões
const pool = mysql.createPool(dbConfig);

// Teste de conexão ao iniciar o servidor
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    console.log(`📋 Conectado ao banco: ${dbConfig.database}`);
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    console.error('Verifique se:');
    console.error('1. O MySQL está rodando');
    console.error('2. As credenciais no arquivo .env estão corretas');
    console.error('3. O banco de dados foi criado');
    process.exit(1);
  }
}

module.exports = {
  pool,
  testConnection
};

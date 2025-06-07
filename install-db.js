
const fs = require('fs');
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🚀 Iniciando instalação do banco de dados...\n');

async function installDatabase() {
  try {
    // 1. Verificar se o arquivo .env existe
    if (!fs.existsSync('.env')) {
      console.log('❌ Arquivo .env não encontrado!');
      console.log('📝 Crie o arquivo .env com suas configurações do MySQL:');
      console.log('DB_HOST=localhost');
      console.log('DB_USER=root');
      console.log('DB_PASSWORD=sua_senha');
      console.log('DB_NAME=sistema_cobrancas\n');
      process.exit(1);
    }

    // 2. Verificar variáveis do .env
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Variáveis obrigatórias não encontradas no .env:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      process.exit(1);
    }

    // 3. Testar conexão MySQL
    console.log('🔍 Testando conexão com MySQL...');
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      });
      console.log('✅ Conexão com MySQL estabelecida!');
      await connection.end();
    } catch (error) {
      console.log('❌ Erro de conexão com MySQL:', error.message);
      console.log('📝 Verifique se:');
      console.log('   - O MySQL está rodando');
      console.log('   - As credenciais no .env estão corretas');
      process.exit(1);
    }

    // 4. Executar script SQL
    console.log('📊 Criando banco de dados...');
    const sqlFile = 'src/server/database/setup.sql';
    
    if (!fs.existsSync(sqlFile)) {
      console.log(`❌ Arquivo ${sqlFile} não encontrado!`);
      process.exit(1);
    }

    const command = `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} < ${sqlFile}`;
    execSync(command, { stdio: 'inherit' });

    console.log('\n✅ Banco de dados criado com sucesso!');
    console.log('\n🔐 Credenciais de acesso:');
    console.log('👤 Admin: admin@sistema.com / admin123');
    console.log('🏢 Empresa: usuario@empresaexemplo.com / empresa123');
    console.log('\n🎯 Próximos passos:');
    console.log('1. cd src/server && npm install');
    console.log('2. npm start (backend)');
    console.log('3. npm run dev (frontend)');

  } catch (error) {
    console.error('❌ Erro durante a instalação:', error.message);
    process.exit(1);
  }
}

installDatabase();

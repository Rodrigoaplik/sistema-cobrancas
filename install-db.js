
const fs = require('fs');
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🚀 Iniciando instalação completa do Sistema de Cobranças...\n');

async function installDatabase() {
  try {
    // 1. Verificar se o arquivo .env existe
    if (!fs.existsSync('.env')) {
      console.log('❌ Arquivo .env não encontrado!');
      console.log('📝 Por favor, crie o arquivo .env com suas configurações:');
      console.log(`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=sistema_cobrancas
PORT=5000
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_deve_ser_muito_longa_e_complexa
VITE_API_URL=http://localhost:5000/api
      `);
      process.exit(1);
    }

    // 2. Verificar variáveis do .env
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Variáveis obrigatórias não encontradas no .env:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      process.exit(1);
    }

    // 3. Testar conexão MySQL (sem especificar banco)
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
      console.log('   - O usuário tem permissões para criar bancos');
      process.exit(1);
    }

    // 4. Criar banco de dados se não existir
    console.log('📊 Criando/verificando banco de dados...');
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      });
      
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`✅ Banco '${process.env.DB_NAME}' criado/verificado com sucesso!`);
      await connection.end();
    } catch (error) {
      console.log('❌ Erro ao criar banco:', error.message);
      process.exit(1);
    }

    // 5. Executar script SQL
    console.log('📋 Executando estrutura do banco...');
    const sqlFile = 'src/server/database/setup.sql';
    
    if (!fs.existsSync(sqlFile)) {
      console.log(`❌ Arquivo ${sqlFile} não encontrado!`);
      process.exit(1);
    }

    try {
      const command = process.platform === 'win32' 
        ? `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} < ${sqlFile}`
        : `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} < ${sqlFile}`;
      
      execSync(command, { stdio: 'inherit' });
      console.log('✅ Estrutura do banco criada com sucesso!');
    } catch (error) {
      console.log('❌ Erro ao executar SQL:', error.message);
      process.exit(1);
    }

    // 6. Verificar se as tabelas foram criadas
    console.log('🔍 Verificando tabelas criadas...');
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`✅ ${tables.length} tabelas criadas com sucesso!`);
      
      // Verificar dados iniciais
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM usuarios');
      const [empresas] = await connection.execute('SELECT COUNT(*) as count FROM empresas');
      
      console.log(`📊 Dados iniciais: ${users[0].count} usuários, ${empresas[0].count} empresas`);
      
      await connection.end();
    } catch (error) {
      console.log('❌ Erro ao verificar tabelas:', error.message);
      process.exit(1);
    }

    console.log('\n🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('\n🔐 Credenciais de acesso:');
    console.log('👤 Admin: admin@sistema.com / admin123');
    console.log('🏢 Empresa: usuario@empresaexemplo.com / empresa123');
    console.log('\n🚀 Próximos passos:');
    console.log('1. cd src/server');
    console.log('2. npm install');
    console.log('3. npm start (para iniciar o backend)');
    console.log('4. Em outro terminal: npm run dev (para iniciar o frontend)');
    console.log('\n🌐 URLs de acesso:');
    console.log('- Frontend: http://localhost:5173');
    console.log('- Backend API: http://localhost:5000');

  } catch (error) {
    console.error('❌ Erro durante a instalação:', error.message);
    process.exit(1);
  }
}

installDatabase();

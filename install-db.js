
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
      console.log('📝 Execute primeiro: node setup.js');
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

    if (process.env.DB_PASSWORD === 'sua_senha_mysql_aqui') {
      console.log('❌ Configure sua senha real do MySQL no arquivo .env!');
      console.log('📝 Edite: DB_PASSWORD=sua_senha_real');
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
      console.log('   - O usuário tem permissões para criar bancos');
      process.exit(1);
    }

    // 4. Executar script SQL completo
    console.log('📊 Criando banco de dados completo...');
    const sqlFile = 'src/server/database/complete-database.sql';
    
    if (!fs.existsSync(sqlFile)) {
      console.log(`❌ Arquivo ${sqlFile} não encontrado!`);
      console.log('📝 Execute primeiro: node setup.js');
      process.exit(1);
    }

    try {
      const command = `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} < ${sqlFile}`;
      execSync(command, { stdio: 'inherit' });
      console.log('✅ Banco de dados criado com sucesso!');
    } catch (error) {
      console.log('❌ Erro ao executar SQL:', error.message);
      process.exit(1);
    }

    // 5. Verificar se foi criado corretamente
    console.log('🔍 Verificando estrutura criada...');
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      
      // Verificar tabelas
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`✅ ${tables.length} tabelas criadas!`);
      
      // Verificar dados iniciais
      const [empresas] = await connection.execute('SELECT COUNT(*) as count FROM empresas');
      const [usuarios] = await connection.execute('SELECT COUNT(*) as count FROM usuarios');
      const [clientes] = await connection.execute('SELECT COUNT(*) as count FROM clientes');
      const [cobrancas] = await connection.execute('SELECT COUNT(*) as count FROM cobrancas');
      
      console.log('📊 Dados iniciais carregados:');
      console.log(`   - ${empresas[0].count} empresas`);
      console.log(`   - ${usuarios[0].count} usuários`);
      console.log(`   - ${clientes[0].count} clientes`);
      console.log(`   - ${cobrancas[0].count} cobranças`);
      
      await connection.end();
    } catch (error) {
      console.log('❌ Erro ao verificar estrutura:', error.message);
      process.exit(1);
    }

    console.log('\n🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('\n🔐 Credenciais de acesso:');
    console.log('👤 Admin: admin@sistema.com / admin123');
    console.log('🏢 Empresa 1: usuario@empresaexemplo.com / empresa123');
    console.log('🏢 Empresa 2: carlos@techsolutions.com / empresa123');
    console.log('🏢 Empresa 3: ana@consultoriaxyz.com / empresa123');
    
    console.log('\n🚀 Próximos passos:');
    console.log('1. cd src/server');
    console.log('2. npm install');
    console.log('3. npm start (para iniciar o backend)');
    console.log('4. Em outro terminal: npm run dev (para iniciar o frontend)');
    
    console.log('\n🌐 URLs de acesso:');
    console.log('- Frontend: http://localhost:5173');
    console.log('- Backend API: http://localhost:5000');
    console.log('- Teste API: http://localhost:5000/api');

  } catch (error) {
    console.error('❌ Erro durante a instalação:', error.message);
    process.exit(1);
  }
}

installDatabase();

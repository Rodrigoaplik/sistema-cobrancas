
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando o Sistema de Cobranças...\n');

// Verificar se o arquivo .env existe
if (!fs.existsSync('.env')) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('Por favor, configure o arquivo .env com suas credenciais do MySQL.');
  console.log('Exemplo:');
  console.log('DB_HOST=localhost');
  console.log('DB_USER=root');
  console.log('DB_PASSWORD=sua_senha');
  console.log('DB_NAME=sistema_cobrancas');
  console.log('JWT_SECRET=sua_chave_secreta\n');
  process.exit(1);
}

try {
  // Instalar dependências do backend
  console.log('📦 Instalando dependências do backend...');
  process.chdir('src/server');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Setup concluído!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure suas credenciais no arquivo .env');
  console.log('2. Execute o setup.sql no MySQL para criar o banco');
  console.log('3. Execute "npm run dev" para iniciar o frontend');
  console.log('4. Execute "cd src/server && npm start" para iniciar o backend');
  console.log('\n🔐 Credenciais padrão:');
  console.log('Admin: admin@sistema.com / admin123');
  console.log('Empresa: usuario@empresaexemplo.com / empresa123');
  
} catch (error) {
  console.error('❌ Erro durante o setup:', error.message);
  process.exit(1);
}

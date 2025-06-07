
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando o Sistema de Cobranças...\n');

// Verificar se o arquivo .env existe
if (!fs.existsSync('.env')) {
  console.log('📝 Criando arquivo .env...');
  const envContent = `# Configurações do banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql_aqui
DB_NAME=sistema_cobrancas

# Configurações do servidor
PORT=5000
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_deve_ser_muito_longa_e_complexa

# URL da API (usado pelo frontend)
VITE_API_URL=http://localhost:5000/api
`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ Arquivo .env criado!');
  console.log('⚠️  ATENÇÃO: Configure sua senha do MySQL no arquivo .env\n');
}

try {
  // Instalar dependências do backend
  console.log('📦 Instalando dependências do backend...');
  process.chdir('src/server');
  
  // Limpar cache e node_modules
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log('🧹 Cache do NPM limpo');
  } catch (error) {
    console.log('⚠️  Não foi possível limpar o cache');
  }
  
  // Instalar dependências
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Setup do backend concluído!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure sua senha do MySQL no arquivo .env');
  console.log('2. Execute "node ../../install-db.js" para criar o banco');
  console.log('3. Execute "npm start" para iniciar o backend');
  console.log('4. Em outro terminal, execute "npm run dev" na raiz para o frontend');
  console.log('\n🔐 Credenciais padrão após instalação:');
  console.log('Admin: admin@sistema.com / admin123');
  console.log('Empresa: usuario@empresaexemplo.com / empresa123');
  
} catch (error) {
  console.error('❌ Erro durante o setup:', error.message);
  console.log('\n🔧 Solução alternativa:');
  console.log('1. Entre na pasta: cd src/server');
  console.log('2. Limpe o cache: npm cache clean --force');
  console.log('3. Instale: npm install bcryptjs express mysql2 jsonwebtoken cors dotenv node-schedule uuid nodemon --save');
  process.exit(1);
}

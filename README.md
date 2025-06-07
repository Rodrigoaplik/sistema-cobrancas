
# Sistema de Cobranças

Sistema completo para gerenciamento de cobranças com frontend React e backend Node.js.

## 🚀 Instalação Rápida

### 1. Configure o MySQL
- Certifique-se que o MySQL está rodando
- Anote a senha do usuário `root`

### 2. Configure o projeto
```bash
# Instalar dependências do backend
node setup.js

# Configurar banco de dados
node install-db.js
```

### 3. Configure o arquivo .env
Edite o arquivo `.env` e defina sua senha do MySQL:
```env
DB_PASSWORD=sua_senha_mysql_real
```

### 4. Inicie o sistema
```bash
# Terminal 1 - Backend
cd src/server
npm start

# Terminal 2 - Frontend
npm run dev
```

## 🔐 Credenciais Padrão

- **Admin**: admin@sistema.com / admin123
- **Empresa**: usuario@empresaexemplo.com / empresa123

## 📋 URLs de Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Teste API**: http://localhost:5000/api

## 🛠️ Estrutura do Projeto

```
├── src/
│   ├── server/           # Backend Node.js
│   │   ├── controllers/  # Controladores
│   │   ├── models/       # Modelos de dados
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Serviços
│   │   ├── middleware/   # Middlewares
│   │   ├── config/       # Configurações
│   │   └── database/     # Scripts SQL
│   ├── components/       # Componentes React
│   ├── pages/           # Páginas
│   ├── services/        # Serviços do frontend
│   └── contexts/        # Contextos React
├── .env                 # Variáveis de ambiente
└── package.json         # Dependências do frontend
```

## 🔧 Comandos Úteis

```bash
# Reinstalar dependências do backend
cd src/server && npm install

# Recriar banco de dados
node install-db.js

# Verificar logs do backend
cd src/server && npm start

# Verificar cobranças vencidas
cd src/server && node -e "require('./models/cobrancaModel').verificarCobrancasVencidas()"
```

## 📦 Tecnologias

### Backend
- Node.js + Express
- MySQL
- JWT para autenticação
- bcryptjs para senhas
- node-schedule para tarefas

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React Query
- React Router

## 🐛 Solução de Problemas

### Erro de bcrypt
Se encontrar erros com bcrypt, o projeto usa `bcryptjs` que não precisa compilação.

### Erro de conexão MySQL
1. Verifique se o MySQL está rodando
2. Confirme credenciais no `.env`
3. Teste conexão: `mysql -u root -p`

### Erro de permissões
Execute os comandos como administrador no Windows.

## 📞 Suporte

Para problemas técnicos, verifique:
1. Logs do backend (`npm start`)
2. Console do navegador (F12)
3. Arquivo `.env` configurado corretamente

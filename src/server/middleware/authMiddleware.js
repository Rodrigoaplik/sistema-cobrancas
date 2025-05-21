
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui'; // Em produção, usar variável de ambiente

// Middleware para verificar se o usuário está autenticado
const verificarToken = async (req, res, next) => {
  try {
    // Obter o token do cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }
    
    // Verificar se o formato do token é válido (Bearer TOKEN)
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ erro: 'Formato de token inválido' });
    }
    
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ erro: 'Formato de token inválido' });
    }
    
    // Verificar se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar o usuário pelo ID no token
    const usuario = await usuarioModel.findById(decoded.userId);
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }
    
    // Adicionar dados do usuário na requisição para uso posterior
    req.user = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role
    };
    
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ erro: 'Token inválido' });
    }
    
    console.error('Erro ao verificar token:', error);
    return res.status(500).json({
      erro: 'Erro interno ao verificar autenticação',
      mensagem: error.message
    });
  }
};

// Middleware para verificar a função/permissão do usuário
const verificarRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    
    if (roles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({ erro: 'Acesso negado. Permissão insuficiente' });
  };
};

module.exports = {
  verificarToken,
  verificarRole
};

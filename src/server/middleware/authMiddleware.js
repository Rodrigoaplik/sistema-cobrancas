
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ erro: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await usuarioModel.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ erro: 'Token inválido' });
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      empresaId: usuario.empresa_id
    };

    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

module.exports = {
  verificarToken,
  verificarAdmin
};

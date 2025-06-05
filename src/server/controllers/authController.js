
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      // Buscar usuário por email
      const usuario = await usuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          role: usuario.role,
          empresaId: usuario.empresa_id 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remover senha do objeto de resposta
      const { senha_hash, ...usuarioSeguro } = usuario;

      res.json({ 
        user: {
          id: usuarioSeguro.id,
          nome: usuarioSeguro.nome,
          email: usuarioSeguro.email,
          role: usuarioSeguro.role,
          empresaId: usuarioSeguro.empresa_id,
          empresaNome: usuarioSeguro.empresa_nome
        }, 
        token 
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async registrar(req, res) {
    try {
      const { nome, email, senha, role = 'usuario', empresaId } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
      }

      // Verificar se o email já existe
      const usuarioExistente = await usuarioModel.findByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Criar usuário
      const novoUsuario = await usuarioModel.create({
        nome,
        email,
        senha_hash: senhaHash,
        role,
        empresa_id: empresaId
      });

      // Remover senha do objeto de resposta
      const { senha_hash, ...usuarioSeguro } = novoUsuario;

      res.status(201).json({ user: usuarioSeguro });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async verificarToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ valid: false, erro: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await usuarioModel.findById(decoded.id);

      if (!usuario) {
        return res.status(401).json({ valid: false, erro: 'Usuário não encontrado' });
      }

      const { senha_hash, ...usuarioSeguro } = usuario;

      res.json({ 
        valid: true, 
        user: {
          id: usuarioSeguro.id,
          nome: usuarioSeguro.nome,
          email: usuarioSeguro.email,
          role: usuarioSeguro.role,
          empresaId: usuarioSeguro.empresa_id,
          empresaNome: usuarioSeguro.empresa_nome
        }
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      res.status(401).json({ valid: false, erro: 'Token inválido' });
    }
  }
}

module.exports = new AuthController();

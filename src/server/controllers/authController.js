
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui'; // Em produção, usar variável de ambiente
const TOKEN_EXPIRATION = '24h'; // Token expira em 24 horas

class AuthController {
  // Login de usuário
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      
      // Validar os dados de entrada
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }
      
      // Buscar usuário pelo email
      const usuario = await usuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: 'Usuário não encontrado' });
      }
      
      // Verificar se a senha está correta
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          userId: usuario.id, 
          email: usuario.email,
          role: usuario.role 
        }, 
        JWT_SECRET, 
        { expiresIn: TOKEN_EXPIRATION }
      );
      
      // Remover senha antes de enviar resposta
      const { senha_hash, ...usuarioSemSenha } = usuario;
      
      res.status(200).json({
        message: 'Login realizado com sucesso',
        token,
        user: usuarioSemSenha
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao processar login',
        mensagem: error.message
      });
    }
  }

  // Verificar se o token é válido
  async verificarToken(req, res) {
    try {
      // O middleware de autenticação já teria validado o token
      // Esta rota só é acessível com um token válido
      res.status(200).json({
        valid: true,
        user: req.user
      });
    } catch (error) {
      console.error('Erro na verificação de token:', error);
      res.status(401).json({
        erro: 'Token inválido',
        mensagem: error.message
      });
    }
  }
  
  // Registrar novo usuário
  async registrar(req, res) {
    try {
      const { nome, email, senha, role = 'usuario' } = req.body;
      
      // Validar os dados de entrada
      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
      }
      
      // Verificar se o email já está em uso
      const usuarioExistente = await usuarioModel.findByEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ erro: 'Este email já está em uso' });
      }
      
      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
      
      // Criar o novo usuário
      const novoUsuario = await usuarioModel.create({
        nome,
        email,
        senha_hash: senhaHash,
        role
      });
      
      // Remover senha antes de enviar resposta
      const { senha_hash, ...usuarioSemSenha } = novoUsuario;
      
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: usuarioSemSenha
      });
    } catch (error) {
      console.error('Erro no registro de usuário:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao registrar usuário',
        mensagem: error.message
      });
    }
  }
}

module.exports = new AuthController();

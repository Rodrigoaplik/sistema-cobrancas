
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const empresaModel = require('../models/empresaModel');
const usuarioModel = require('../models/usuarioModel');

class EmpresaController {
  // Criar nova empresa com usuário administrador
  async createEmpresaWithUser(req, res) {
    try {
      const { empresa, usuario } = req.body;
      
      // Validar dados obrigatórios
      if (!empresa.nome || !empresa.email || !empresa.telefone) {
        return res.status(400).json({ erro: 'Nome, email e telefone da empresa são obrigatórios' });
      }
      
      if (!usuario.nome || !usuario.email || !usuario.senha) {
        return res.status(400).json({ erro: 'Nome, email e senha do usuário são obrigatórios' });
      }
      
      // Verificar se email da empresa já existe
      const empresaExistente = await empresaModel.findByEmail(empresa.email);
      if (empresaExistente) {
        return res.status(409).json({ erro: 'Este email de empresa já está em uso' });
      }
      
      // Verificar se email do usuário já existe
      const usuarioExistente = await usuarioModel.findByEmail(usuario.email);
      if (usuarioExistente) {
        return res.status(409).json({ erro: 'Este email de usuário já está em uso' });
      }
      
      // Criar a empresa
      const empresaId = uuidv4();
      const novaEmpresa = await empresaModel.create({
        id: empresaId,
        ...empresa
      });
      
      // Hash da senha do usuário
      const senhaHash = await bcrypt.hash(usuario.senha, 10);
      
      // Criar o usuário administrador da empresa
      const novoUsuario = await usuarioModel.create({
        nome: usuario.nome,
        email: usuario.email,
        senha_hash: senhaHash,
        role: 'empresa',
        empresa_id: empresaId
      });
      
      // Remover senha antes de enviar resposta
      const { senha_hash, ...usuarioSemSenha } = novoUsuario;
      
      res.status(201).json({
        message: 'Empresa e usuário criados com sucesso',
        empresa: novaEmpresa,
        usuario: usuarioSemSenha
      });
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao criar empresa',
        mensagem: error.message
      });
    }
  }
  
  // Listar todas as empresas (apenas admin)
  async getAll(req, res) {
    try {
      const empresas = await empresaModel.findAll();
      res.status(200).json(empresas);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar empresas',
        mensagem: error.message
      });
    }
  }
  
  // Buscar empresa por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const empresa = await empresaModel.findById(id);
      
      if (!empresa) {
        return res.status(404).json({ erro: 'Empresa não encontrada' });
      }
      
      res.status(200).json(empresa);
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar empresa',
        mensagem: error.message
      });
    }
  }
  
  // Atualizar empresa
  async update(req, res) {
    try {
      const { id } = req.params;
      const dadosEmpresa = req.body;
      
      const empresaAtualizada = await empresaModel.update(id, dadosEmpresa);
      res.status(200).json({
        message: 'Empresa atualizada com sucesso',
        empresa: empresaAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao atualizar empresa',
        mensagem: error.message
      });
    }
  }
  
  // Buscar estatísticas das empresas
  async getStats(req, res) {
    try {
      const stats = await empresaModel.getStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar estatísticas',
        mensagem: error.message
      });
    }
  }
}

module.exports = new EmpresaController();

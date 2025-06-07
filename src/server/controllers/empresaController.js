
const empresaModel = require('../models/empresaModel');
const { verificarAdmin } = require('../middleware/authMiddleware');

class EmpresaController {
  // Listar todas as empresas (apenas admin)
  async listarEmpresas(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
      }
      
      const empresas = await empresaModel.findAll();
      res.json(empresas);
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao listar empresas',
        mensagem: error.message
      });
    }
  }

  // Buscar uma empresa específica
  async buscarEmpresa(req, res) {
    try {
      const { id } = req.params;
      
      // Admin pode ver qualquer empresa, outros usuários apenas a própria
      if (req.user.role !== 'admin' && req.user.empresaId !== id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }
      
      const empresa = await empresaModel.findById(id);
      if (!empresa) {
        return res.status(404).json({ erro: 'Empresa não encontrada' });
      }
      
      res.json(empresa);
    } catch (error) {
      console.error(`Erro ao buscar empresa com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar empresa',
        mensagem: error.message
      });
    }
  }

  // Criar uma nova empresa (apenas admin)
  async criarEmpresa(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
      }
      
      const novaEmpresa = req.body;
      
      // Validações básicas
      if (!novaEmpresa.nome || !novaEmpresa.email || !novaEmpresa.telefone) {
        return res.status(400).json({ erro: 'Nome, email e telefone são obrigatórios' });
      }
      
      // Verificar se o email já existe
      const empresaExistente = await empresaModel.findByEmail(novaEmpresa.email);
      if (empresaExistente) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
      
      const empresaCriada = await empresaModel.create(novaEmpresa);
      res.status(201).json(empresaCriada);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao criar empresa',
        mensagem: error.message
      });
    }
  }

  // Atualizar uma empresa existente
  async atualizarEmpresa(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
      // Admin pode atualizar qualquer empresa, outros usuários apenas a própria
      if (req.user.role !== 'admin' && req.user.empresaId !== id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }
      
      const empresaAtualizada = await empresaModel.update(id, dadosAtualizacao);
      res.json(empresaAtualizada);
    } catch (error) {
      if (error.message === 'Empresa não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao atualizar empresa com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao atualizar empresa',
        mensagem: error.message
      });
    }
  }

  // Excluir uma empresa (apenas admin)
  async excluirEmpresa(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
      }
      
      const { id } = req.params;
      
      await empresaModel.delete(id);
      res.json({ mensagem: 'Empresa excluída com sucesso' });
    } catch (error) {
      if (error.message === 'Empresa não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao excluir empresa com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao excluir empresa',
        mensagem: error.message
      });
    }
  }

  // Obter estatísticas das empresas (apenas admin)
  async obterEstatisticas(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
      }
      
      const stats = await empresaModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Erro ao obter estatísticas das empresas:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao obter estatísticas',
        mensagem: error.message
      });
    }
  }
}

module.exports = new EmpresaController();

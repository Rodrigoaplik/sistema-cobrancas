
const empresaModel = require('../models/empresaModel');

class EmpresaController {
  async listarEmpresas(req, res) {
    try {
      // Apenas admins podem listar todas as empresas
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const empresas = await empresaModel.findAll();
      res.json(empresas);
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

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
      console.error('Erro ao buscar empresa:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async criarEmpresa(req, res) {
    try {
      // Apenas admins podem criar empresas
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const empresa = await empresaModel.create(req.body);
      res.status(201).json(empresa);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async atualizarEmpresa(req, res) {
    try {
      const { id } = req.params;
      
      // Admin pode atualizar qualquer empresa, outros usuários apenas a própria
      if (req.user.role !== 'admin' && req.user.empresaId !== id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const empresa = await empresaModel.update(id, req.body);
      res.json(empresa);
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      if (error.message === 'Empresa não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async excluirEmpresa(req, res) {
    try {
      // Apenas admins podem excluir empresas
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const { id } = req.params;
      
      await empresaModel.delete(id);
      res.json({ mensagem: 'Empresa excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      if (error.message === 'Empresa não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async obterEstatisticas(req, res) {
    try {
      // Apenas admins podem ver estatísticas gerais
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const stats = await empresaModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new EmpresaController();

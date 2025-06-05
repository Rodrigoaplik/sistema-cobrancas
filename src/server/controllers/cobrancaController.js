
const cobrancaModel = require('../models/cobrancaModel');

class CobrancaController {
  async listarCobrancas(req, res) {
    try {
      let cobrancas;
      
      if (req.user.role === 'admin') {
        cobrancas = await cobrancaModel.findAll();
      } else {
        cobrancas = await cobrancaModel.findByEmpresa(req.user.empresaId);
      }

      res.json(cobrancas);
    } catch (error) {
      console.error('Erro ao listar cobranças:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async listarCobrancasPorCliente(req, res) {
    try {
      const { clienteId } = req.params;
      
      // Buscar cobranças por cliente (filtrar por empresa se não for admin)
      let cobrancas;
      if (req.user.role === 'admin') {
        cobrancas = await cobrancaModel.findAll();
        cobrancas = cobrancas.filter(c => c.cliente_id === clienteId);
      } else {
        cobrancas = await cobrancaModel.findByEmpresa(req.user.empresaId);
        cobrancas = cobrancas.filter(c => c.cliente_id === clienteId);
      }

      res.json(cobrancas);
    } catch (error) {
      console.error('Erro ao listar cobranças do cliente:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async buscarCobranca(req, res) {
    try {
      const { id } = req.params;
      const empresaId = req.user.role === 'admin' ? null : req.user.empresaId;
      
      const cobranca = await cobrancaModel.findById(id, empresaId);
      
      if (!cobranca) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }

      res.json(cobranca);
    } catch (error) {
      console.error('Erro ao buscar cobrança:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async criarCobranca(req, res) {
    try {
      const { clienteId } = req.params;
      
      const dadosCobranca = {
        ...req.body,
        cliente_id: clienteId,
        empresa_id: req.user.role === 'admin' ? req.body.empresa_id : req.user.empresaId
      };

      const cobranca = await cobrancaModel.create(dadosCobranca);
      res.status(201).json(cobranca);
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async atualizarCobranca(req, res) {
    try {
      const { id } = req.params;
      const empresaId = req.user.role === 'admin' ? null : req.user.empresaId;
      
      const cobranca = await cobrancaModel.update(id, req.body, empresaId);
      res.json(cobranca);
    } catch (error) {
      console.error('Erro ao atualizar cobrança:', error);
      if (error.message === 'Cobrança não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async excluirCobrança(req, res) {
    try {
      const { id } = req.params;
      const empresaId = req.user.role === 'admin' ? null : req.user.empresaId;
      
      await cobrancaModel.delete(id, empresaId);
      res.json({ mensagem: 'Cobrança excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir cobrança:', error);
      if (error.message === 'Cobrança não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, dataPagamento } = req.body;
      const empresaId = req.user.role === 'admin' ? null : req.user.empresaId;

      const dadosAtualizacao = {
        status,
        data_pagamento: dataPagamento
      };

      // Buscar cobrança atual para manter outros dados
      const cobrancaAtual = await cobrancaModel.findById(id, empresaId);
      if (!cobrancaAtual) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }

      // Atualizar apenas o status e data de pagamento
      const cobrancaAtualizada = {
        ...cobrancaAtual,
        ...dadosAtualizacao
      };

      const cobranca = await cobrancaModel.update(id, cobrancaAtualizada, empresaId);
      res.json(cobranca);
    } catch (error) {
      console.error('Erro ao atualizar status da cobrança:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async verificarCobrancasVencidas(req, res) {
    try {
      const resultado = await cobrancaModel.verificarCobranfasVencidas();
      res.json(resultado);
    } catch (error) {
      console.error('Erro ao verificar cobranças vencidas:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new CobrancaController();

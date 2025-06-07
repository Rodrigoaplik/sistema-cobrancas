
const cobrancaModel = require('../models/cobrancaModel');
const clienteModel = require('../models/clienteModel');

class CobrancaController {
  // Listar todas as cobranças (com filtro por empresa se não for admin)
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
      res.status(500).json({
        erro: 'Erro interno do servidor ao listar cobranças',
        mensagem: error.message
      });
    }
  }

  // Listar cobranças por cliente
  async listarCobrancasPorCliente(req, res) {
    try {
      const { clienteId } = req.params;
      
      // Verificar se o cliente existe e pertence à empresa (se não for admin)
      const cliente = await clienteModel.findById(clienteId, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      const cobrancas = await cobrancaModel.findByCliente(clienteId);
      res.json(cobrancas);
    } catch (error) {
      console.error('Erro ao listar cobranças do cliente:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao listar cobranças do cliente',
        mensagem: error.message
      });
    }
  }

  // Buscar uma cobrança específica
  async buscarCobranca(req, res) {
    try {
      const { id } = req.params;
      
      const cobranca = await cobrancaModel.findById(id, req.user.role === 'admin' ? null : req.user.empresaId);
      
      if (!cobranca) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }
      
      res.json(cobranca);
    } catch (error) {
      console.error(`Erro ao buscar cobrança com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar cobrança',
        mensagem: error.message
      });
    }
  }

  // Criar uma nova cobrança
  async criarCobranca(req, res) {
    try {
      const { clienteId } = req.params;
      const novaCobranca = req.body;
      
      // Verificar se o cliente existe e pertence à empresa
      const cliente = await clienteModel.findById(clienteId, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      // Validações básicas
      if (!novaCobranca.descricao || !novaCobranca.valor || !novaCobranca.data_vencimento) {
        return res.status(400).json({ erro: 'Descrição, valor e data de vencimento são obrigatórios' });
      }
      
      // Adicionar empresa_id e cliente_id
      const cobrancaParaBanco = {
        ...novaCobranca,
        empresa_id: cliente.empresa_id,
        cliente_id: clienteId
      };
      
      const cobrancaCriada = await cobrancaModel.create(cobrancaParaBanco);
      res.status(201).json(cobrancaCriada);
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao criar cobrança',
        mensagem: error.message
      });
    }
  }

  // Atualizar uma cobrança existente
  async atualizarCobranca(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
      const cobrancaAtualizada = await cobrancaModel.update(id, dadosAtualizacao, req.user.role === 'admin' ? null : req.user.empresaId);
      res.json(cobrancaAtualizada);
    } catch (error) {
      if (error.message === 'Cobrança não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao atualizar cobrança com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao atualizar cobrança',
        mensagem: error.message
      });
    }
  }

  // Excluir uma cobrança
  async excluirCobranca(req, res) {
    try {
      const { id } = req.params;
      
      await cobrancaModel.delete(id, req.user.role === 'admin' ? null : req.user.empresaId);
      res.json({ mensagem: 'Cobrança excluída com sucesso' });
    } catch (error) {
      if (error.message === 'Cobrança não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao excluir cobrança com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao excluir cobrança',
        mensagem: error.message
      });
    }
  }

  // Atualizar apenas o status de uma cobrança
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, data_pagamento } = req.body;
      
      if (!status) {
        return res.status(400).json({ erro: 'Status é obrigatório' });
      }
      
      const dadosAtualizacao = { status };
      if (status === 'pago' && data_pagamento) {
        dadosAtualizacao.data_pagamento = data_pagamento;
      }
      
      const cobrancaAtualizada = await cobrancaModel.update(id, dadosAtualizacao, req.user.role === 'admin' ? null : req.user.empresaId);
      res.json(cobrancaAtualizada);
    } catch (error) {
      if (error.message === 'Cobrança não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao atualizar status da cobrança com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao atualizar status',
        mensagem: error.message
      });
    }
  }

  // Verificar cobranças vencidas
  async verificarCobrancasVencidas(req, res) {
    try {
      console.log('Iniciando verificação de cobranças vencidas...');
      const resultado = await cobrancaModel.verificarCobrancasVencidas();
      console.log('Verificação concluída:', resultado);
      
      res.json({
        ...resultado,
        mensagem: `${resultado.atualizadas} cobrança(s) atualizada(s) para status 'atrasado'`
      });
    } catch (error) {
      console.error('Erro ao verificar cobranças vencidas:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao verificar cobranças vencidas',
        mensagem: error.message
      });
    }
  }
}

module.exports = new CobrancaController();

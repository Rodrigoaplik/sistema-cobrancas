
const cobrancaModel = require('../models/cobrancaModel');
const clienteModel = require('../models/clienteModel');

class CobrancaController {
  // Listar todas as cobranças
  async listarCobrancas(req, res) {
    try {
      const cobrancas = await cobrancaModel.findAll();
      
      // Formatar datas para o frontend
      const cobrancasFormatadas = cobrancas.map(c => ({
        id: c.id,
        clienteId: c.cliente_id,
        descricao: c.descricao,
        valor: parseFloat(c.valor),
        dataVencimento: c.data_vencimento,
        status: c.status,
        dataPagamento: c.data_pagamento,
      }));
      
      res.status(200).json(cobrancasFormatadas);
    } catch (error) {
      console.error('Erro ao listar cobranças:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar cobranças',
        mensagem: error.message
      });
    }
  }

  // Listar cobranças por cliente
  async listarCobrancasPorCliente(req, res) {
    try {
      const { clienteId } = req.params;
      
      // Verificar se o cliente existe
      const cliente = await clienteModel.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      const cobrancas = await cobrancaModel.findByClienteId(clienteId);
      
      // Formatar datas para o frontend
      const cobrancasFormatadas = cobrancas.map(c => ({
        id: c.id,
        clienteId: c.cliente_id,
        descricao: c.descricao,
        valor: parseFloat(c.valor),
        dataVencimento: c.data_vencimento,
        status: c.status,
        dataPagamento: c.data_pagamento,
      }));
      
      res.status(200).json(cobrancasFormatadas);
    } catch (error) {
      console.error(`Erro ao listar cobranças do cliente ${req.params.clienteId}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar cobranças do cliente',
        mensagem: error.message
      });
    }
  }

  // Buscar cobrança por ID
  async buscarCobranca(req, res) {
    try {
      const { id } = req.params;
      const cobranca = await cobrancaModel.findById(id);
      
      if (!cobranca) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }
      
      // Formatar para o formato esperado pelo frontend
      const cobrancaFormatada = {
        id: cobranca.id,
        clienteId: cobranca.cliente_id,
        descricao: cobranca.descricao,
        valor: parseFloat(cobranca.valor),
        dataVencimento: cobranca.data_vencimento,
        status: cobranca.status,
        dataPagamento: cobranca.data_pagamento,
      };
      
      res.status(200).json(cobrancaFormatada);
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
      
      // Verificar se o cliente existe
      const cliente = await clienteModel.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      // Validações básicas
      if (!novaCobranca.descricao || !novaCobranca.valor || !novaCobranca.dataVencimento) {
        return res.status(400).json({ erro: 'Descrição, valor e data de vencimento são obrigatórios' });
      }
      
      // Formatação para o banco
      const cobrancaParaBanco = {
        clienteId: clienteId,
        descricao: novaCobranca.descricao,
        valor: novaCobranca.valor,
        dataVencimento: novaCobranca.dataVencimento,
        status: novaCobranca.status || 'pendente',
        dataPagamento: novaCobranca.dataPagamento || null
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
      const dadosAtualizados = req.body;
      
      // Verificar se a cobrança existe
      const cobrancaExistente = await cobrancaModel.findById(id);
      if (!cobrancaExistente) {
        return res.status(404).json({ erro: 'Cobrança não encontrada' });
      }
      
      // Validações básicas
      if (!dadosAtualizados.descricao || !dadosAtualizados.valor || !dadosAtualizados.dataVencimento) {
        return res.status(400).json({ erro: 'Descrição, valor e data de vencimento são obrigatórios' });
      }
      
      // Manter o cliente_id original
      const cobrancaParaAtualizar = {
        clienteId: cobrancaExistente.cliente_id,
        descricao: dadosAtualizados.descricao,
        valor: dadosAtualizados.valor,
        dataVencimento: dadosAtualizados.dataVencimento,
        status: dadosAtualizados.status || cobrancaExistente.status,
        dataPagamento: dadosAtualizados.dataPagamento
      };
      
      const cobrancaAtualizada = await cobrancaModel.update(id, cobrancaParaAtualizar);
      res.status(200).json(cobrancaAtualizada);
    } catch (error) {
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
      await cobrancaModel.delete(id);
      res.status(200).json({ mensagem: 'Cobrança excluída com sucesso' });
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

  // Atualizar status de uma cobrança
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, dataPagamento } = req.body;
      
      // Validação do status
      if (!['pendente', 'pago', 'atrasado'].includes(status)) {
        return res.status(400).json({ erro: 'Status inválido' });
      }
      
      const resultado = await cobrancaModel.updateStatus(id, status, dataPagamento);
      res.status(200).json(resultado);
    } catch (error) {
      if (error.message === 'Cobrança não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao atualizar status da cobrança com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao atualizar status da cobrança',
        mensagem: error.message
      });
    }
  }

  // Verificar cobranças vencidas
  async verificarCobrancasVencidas(req, res) {
    try {
      const resultado = await cobrancaModel.verificarCobranfasVencidas();
      res.status(200).json(resultado);
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

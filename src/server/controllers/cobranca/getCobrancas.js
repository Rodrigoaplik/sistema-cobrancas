
const cobrancaModel = require('../../models/cobrancaModel');
const clienteModel = require('../../models/clienteModel');

// Listar todas as cobranças
async function listarCobrancas(req, res) {
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
async function listarCobrancasPorCliente(req, res) {
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
async function buscarCobranca(req, res) {
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

module.exports = {
  listarCobrancas,
  listarCobrancasPorCliente,
  buscarCobranca
};

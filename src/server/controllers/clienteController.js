
const clienteModel = require('../models/clienteModel');

class ClienteController {
  // Listar todos os clientes
  async listarClientes(req, res) {
    try {
      const clientes = await clienteModel.findAll();
      res.status(200).json(clientes);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar clientes',
        mensagem: error.message
      });
    }
  }

  // Buscar cliente por ID
  async buscarCliente(req, res) {
    try {
      const { id } = req.params;
      const cliente = await clienteModel.findById(id);
      
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      res.status(200).json(cliente);
    } catch (error) {
      console.error(`Erro ao buscar cliente com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao buscar cliente',
        mensagem: error.message
      });
    }
  }

  // Criar um novo cliente
  async criarCliente(req, res) {
    try {
      const novoCliente = req.body;
      
      // Validações básicas
      if (!novoCliente.nome || !novoCliente.email) {
        return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
      }
      
      const clienteCriado = await clienteModel.create(novoCliente);
      res.status(201).json(clienteCriado);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao criar cliente',
        mensagem: error.message
      });
    }
  }

  // Atualizar um cliente existente
  async atualizarCliente(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;
      
      // Validações básicas
      if (!dadosAtualizados.nome || !dadosAtualizados.email) {
        return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
      }
      
      const clienteAtualizado = await clienteModel.update(id, dadosAtualizados);
      res.status(200).json(clienteAtualizado);
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao atualizar cliente com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao atualizar cliente',
        mensagem: error.message
      });
    }
  }

  // Excluir um cliente
  async excluirCliente(req, res) {
    try {
      const { id } = req.params;
      await clienteModel.delete(id);
      res.status(200).json({ mensagem: 'Cliente excluído com sucesso' });
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      
      console.error(`Erro ao excluir cliente com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao excluir cliente',
        mensagem: error.message
      });
    }
  }
}

module.exports = new ClienteController();

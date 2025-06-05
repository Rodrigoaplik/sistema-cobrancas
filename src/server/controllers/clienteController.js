
const clienteModel = require('../models/clienteModel');

class ClienteController {
  async listarClientes(req, res) {
    try {
      let clientes;
      
      if (req.user.role === 'admin') {
        clientes = await clienteModel.findAll();
      } else {
        clientes = await clienteModel.findByEmpresa(req.user.empresaId);
      }

      res.json(clientes);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async buscarCliente(req, res) {
    try {
      const { id } = req.params;
      const empresaId = req.user.role === 'admin' ? null : req.user.empresaId;
      
      const cliente = await clienteModel.findById(id, empresaId);
      
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      res.json(cliente);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async criarCliente(req, res) {
    try {
      const dadosCliente = {
        ...req.body,
        empresa_id: req.user.role === 'admin' ? req.body.empresa_id : req.user.empresaId
      };

      const cliente = await clienteModel.create(dadosCliente);
      res.status(201).json(cliente);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async atualizarCliente(req, res) {
    try {
      const { id } = req.params;
      const empresaId = req.user.role === 'admin' ? null : req.user.empresaId;
      
      const cliente = await clienteModel.update(id, req.body, empresaId);
      res.json(cliente);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async excluirCliente(req, res) {
    try {
      const { id } = req.params;
      const empresaId = req.user.role === 'admin' ? null : req.user.empresaId;
      
      await clienteModel.delete(id, empresaId);
      res.json({ mensagem: 'Cliente excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async notificarCliente(req, res) {
    try {
      const { id } = req.params;
      
      // Simulação de envio de notificação
      res.json({
        success: true,
        message: 'Notificação enviada com sucesso',
        linkPagamento: `https://pagamento.exemplo.com/cliente/${id}`
      });
    } catch (error) {
      console.error('Erro ao notificar cliente:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new ClienteController();

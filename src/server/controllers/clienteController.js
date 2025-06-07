
const clienteModel = require('../models/clienteModel');
const notificacaoService = require('../services/comunicacaoService');

class ClienteController {
  // Listar todos os clientes (com filtro por empresa se não for admin)
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
      res.status(500).json({
        erro: 'Erro interno do servidor ao listar clientes',
        mensagem: error.message
      });
    }
  }

  // Buscar um cliente específico
  async buscarCliente(req, res) {
    try {
      const { id } = req.params;
      
      const cliente = await clienteModel.findById(id, req.user.role === 'admin' ? null : req.user.empresaId);
      
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      res.json(cliente);
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
      if (!novoCliente.nome || !novoCliente.email || !novoCliente.telefone) {
        return res.status(400).json({ erro: 'Nome, email e telefone são obrigatórios' });
      }
      
      // Adicionar empresa_id baseado no usuário logado
      if (req.user.role === 'admin' && novoCliente.empresa_id) {
        // Admin pode especificar empresa_id
        novoCliente.empresa_id = novoCliente.empresa_id;
      } else {
        // Usuários normais usam sua própria empresa
        novoCliente.empresa_id = req.user.empresaId;
      }
      
      if (!novoCliente.empresa_id) {
        return res.status(400).json({ erro: 'ID da empresa é obrigatório' });
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
      const dadosAtualizacao = req.body;
      
      const clienteAtualizado = await clienteModel.update(id, dadosAtualizacao, req.user.role === 'admin' ? null : req.user.empresaId);
      res.json(clienteAtualizado);
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
      
      await clienteModel.delete(id, req.user.role === 'admin' ? null : req.user.empresaId);
      res.json({ mensagem: 'Cliente excluído com sucesso' });
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

  // Notificar cliente
  async notificarCliente(req, res) {
    try {
      const { id } = req.params;
      const { tipo, mensagem, assunto } = req.body;
      
      // Verificar se o cliente existe e pertence à empresa
      const cliente = await clienteModel.findById(id, req.user.role === 'admin' ? null : req.user.empresaId);
      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      // Enviar notificação (simulada)
      const resultado = await notificacaoService.enviarNotificacao({
        clienteId: id,
        tipo: tipo || 'geral',
        mensagem: mensagem || 'Notificação do sistema',
        assunto: assunto || 'Sistema de Cobranças'
      });
      
      res.json(resultado);
    } catch (error) {
      console.error(`Erro ao notificar cliente com ID ${req.params.id}:`, error);
      res.status(500).json({
        erro: 'Erro interno do servidor ao enviar notificação',
        mensagem: error.message
      });
    }
  }
}

module.exports = new ClienteController();

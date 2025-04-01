
import api from './api';
import { Cliente } from '@/types';

const clienteService = {
  // Listar todos os clientes
  listarClientes: async (): Promise<Cliente[]> => {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Buscar cliente por ID
  buscarCliente: async (id: string): Promise<Cliente> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  // Criar um novo cliente
  criarCliente: async (cliente: Cliente): Promise<Cliente> => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  // Atualizar um cliente existente
  atualizarCliente: async (id: string, cliente: Cliente): Promise<Cliente> => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  // Excluir um cliente
  excluirCliente: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  }
};

export default clienteService;

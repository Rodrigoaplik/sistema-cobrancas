
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ClienteModel {
  // Buscar todos os clientes
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nome');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Erro ao buscar cliente com ID ${id}:`, error);
      throw error;
    }
  }

  // Criar um novo cliente
  async create(cliente) {
    try {
      const id = uuidv4();
      const query = `
        INSERT INTO clientes 
        (id, nome, email, telefone, whatsapp, endereco, cidade, estado, cep) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(query, [
        id,
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.whatsapp,
        cliente.endereco,
        cliente.cidade,
        cliente.estado,
        cliente.cep
      ]);
      
      return { id, ...cliente };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  // Atualizar um cliente existente
  async update(id, cliente) {
    try {
      const query = `
        UPDATE clientes 
        SET nome = ?, email = ?, telefone = ?, whatsapp = ?, 
            endereco = ?, cidade = ?, estado = ?, cep = ?
        WHERE id = ?
      `;
      
      const [result] = await pool.query(query, [
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.whatsapp,
        cliente.endereco,
        cliente.cidade,
        cliente.estado,
        cliente.cep,
        id
      ]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cliente não encontrado');
      }
      
      return { id, ...cliente };
    } catch (error) {
      console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
      throw error;
    }
  }

  // Excluir um cliente
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cliente não encontrado');
      }
      
      return { id };
    } catch (error) {
      console.error(`Erro ao excluir cliente com ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new ClienteModel();

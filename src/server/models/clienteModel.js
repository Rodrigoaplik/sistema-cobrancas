
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ClienteModel {
  // Buscar clientes por empresa
  async findByEmpresa(empresaId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM clientes WHERE empresa_id = ? ORDER BY nome',
        [empresaId]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar clientes da empresa:', error);
      throw error;
    }
  }

  // Buscar todos os clientes (admin)
  async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT c.*, e.nome as empresa_nome 
        FROM clientes c 
        JOIN empresas e ON c.empresa_id = e.id 
        ORDER BY c.nome
      `);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  async findById(id, empresaId = null) {
    try {
      let query = 'SELECT * FROM clientes WHERE id = ?';
      const params = [id];
      
      if (empresaId) {
        query += ' AND empresa_id = ?';
        params.push(empresaId);
      }
      
      const [rows] = await pool.query(query, params);
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
        (id, empresa_id, nome, email, telefone, whatsapp, endereco, cidade, estado, cep) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(query, [
        id,
        cliente.empresa_id,
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
  async update(id, cliente, empresaId = null) {
    try {
      let query = `
        UPDATE clientes 
        SET nome = ?, email = ?, telefone = ?, whatsapp = ?, 
            endereco = ?, cidade = ?, estado = ?, cep = ?
        WHERE id = ?
      `;
      const params = [
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.whatsapp,
        cliente.endereco,
        cliente.cidade,
        cliente.estado,
        cliente.cep,
        id
      ];
      
      if (empresaId) {
        query += ' AND empresa_id = ?';
        params.push(empresaId);
      }
      
      const [result] = await pool.query(query, params);
      
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
  async delete(id, empresaId = null) {
    try {
      let query = 'DELETE FROM clientes WHERE id = ?';
      const params = [id];
      
      if (empresaId) {
        query += ' AND empresa_id = ?';
        params.push(empresaId);
      }
      
      const [result] = await pool.query(query, params);
      
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

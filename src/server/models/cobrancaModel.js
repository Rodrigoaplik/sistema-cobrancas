
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CobrancaModel {
  // Buscar todas as cobranças
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM cobrancas ORDER BY data_vencimento');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar cobranças:', error);
      throw error;
    }
  }

  // Buscar cobranças por ID do cliente
  async findByClienteId(clienteId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM cobrancas WHERE cliente_id = ? ORDER BY data_vencimento',
        [clienteId]
      );
      return rows;
    } catch (error) {
      console.error(`Erro ao buscar cobranças do cliente ${clienteId}:`, error);
      throw error;
    }
  }

  // Buscar cobrança por ID
  async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM cobrancas WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Erro ao buscar cobrança com ID ${id}:`, error);
      throw error;
    }
  }

  // Criar uma nova cobrança
  async create(cobranca) {
    try {
      const id = uuidv4();
      const query = `
        INSERT INTO cobrancas 
        (id, cliente_id, descricao, valor, data_vencimento, status, data_pagamento) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(query, [
        id,
        cobranca.clienteId,
        cobranca.descricao,
        cobranca.valor,
        cobranca.dataVencimento,
        cobranca.status,
        cobranca.dataPagamento || null
      ]);
      
      return { id, ...cobranca };
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
      throw error;
    }
  }

  // Atualizar uma cobrança existente
  async update(id, cobranca) {
    try {
      const query = `
        UPDATE cobrancas 
        SET descricao = ?, valor = ?, data_vencimento = ?, 
            status = ?, data_pagamento = ?
        WHERE id = ?
      `;
      
      const [result] = await pool.query(query, [
        cobranca.descricao,
        cobranca.valor,
        cobranca.dataVencimento,
        cobranca.status,
        cobranca.dataPagamento || null,
        id
      ]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cobrança não encontrada');
      }
      
      return { id, ...cobranca };
    } catch (error) {
      console.error(`Erro ao atualizar cobrança com ID ${id}:`, error);
      throw error;
    }
  }

  // Excluir uma cobrança
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM cobrancas WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cobrança não encontrada');
      }
      
      return { id };
    } catch (error) {
      console.error(`Erro ao excluir cobrança com ID ${id}:`, error);
      throw error;
    }
  }

  // Atualizar status de cobrança
  async updateStatus(id, status, dataPagamento = null) {
    try {
      const query = `
        UPDATE cobrancas 
        SET status = ?, data_pagamento = ?
        WHERE id = ?
      `;
      
      const [result] = await pool.query(query, [status, dataPagamento, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cobrança não encontrada');
      }
      
      return { id, status, dataPagamento };
    } catch (error) {
      console.error(`Erro ao atualizar status da cobrança com ID ${id}:`, error);
      throw error;
    }
  }

  // Verificar cobranças vencidas e atualizar status
  async verificarCobranfasVencidas() {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const query = `
        UPDATE cobrancas
        SET status = 'atrasado'
        WHERE data_vencimento < ? AND status = 'pendente'
      `;
      
      const [result] = await pool.query(query, [hoje]);
      return { atualizadas: result.affectedRows };
    } catch (error) {
      console.error('Erro ao verificar cobranças vencidas:', error);
      throw error;
    }
  }
}

module.exports = new CobrancaModel();

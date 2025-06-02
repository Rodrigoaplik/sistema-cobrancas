
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CobrancaModel {
  // Buscar cobranças por empresa
  async findByEmpresa(empresaId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM cobrancas WHERE empresa_id = ? ORDER BY data_vencimento DESC',
        [empresaId]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar cobranças da empresa:', error);
      throw error;
    }
  }

  // Buscar todas as cobranças (admin)
  async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT c.*, cl.nome as cliente_nome, e.nome as empresa_nome 
        FROM cobrancas c 
        JOIN clientes cl ON c.cliente_id = cl.id 
        JOIN empresas e ON c.empresa_id = e.id 
        ORDER BY c.data_vencimento DESC
      `);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar cobranças:', error);
      throw error;
    }
  }

  // Buscar cobrança por ID
  async findById(id, empresaId = null) {
    try {
      let query = 'SELECT * FROM cobrancas WHERE id = ?';
      const params = [id];
      
      if (empresaId) {
        query += ' AND empresa_id = ?';
        params.push(empresaId);
      }
      
      const [rows] = await pool.query(query, params);
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
        (id, empresa_id, cliente_id, descricao, valor, data_vencimento, status, data_pagamento) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(query, [
        id,
        cobranca.empresa_id,
        cobranca.cliente_id,
        cobranca.descricao,
        cobranca.valor,
        cobranca.data_vencimento,
        cobranca.status || 'pendente',
        cobranca.data_pagamento || null
      ]);
      
      return { id, ...cobranca };
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
      throw error;
    }
  }

  // Atualizar uma cobrança existente
  async update(id, cobranca, empresaId = null) {
    try {
      let query = `
        UPDATE cobrancas 
        SET descricao = ?, valor = ?, data_vencimento = ?, 
            status = ?, data_pagamento = ?
        WHERE id = ?
      `;
      const params = [
        cobranca.descricao,
        cobranca.valor,
        cobranca.data_vencimento,
        cobranca.status,
        cobranca.data_pagamento || null,
        id
      ];
      
      if (empresaId) {
        query += ' AND empresa_id = ?';
        params.push(empresaId);
      }
      
      const [result] = await pool.query(query, params);
      
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
  async delete(id, empresaId = null) {
    try {
      let query = 'DELETE FROM cobrancas WHERE id = ?';
      const params = [id];
      
      if (empresaId) {
        query += ' AND empresa_id = ?';
        params.push(empresaId);
      }
      
      const [result] = await pool.query(query, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Cobrança não encontrada');
      }
      
      return { id };
    } catch (error) {
      console.error(`Erro ao excluir cobrança com ID ${id}:`, error);
      throw error;
    }
  }

  // Verificar cobranças vencidas e atualizar status
  async verificarCobranfasVencidas() {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      console.log(`Verificando cobranças vencidas (antes de ${hoje})...`);
      
      const query = `
        UPDATE cobrancas
        SET status = 'atrasado'
        WHERE data_vencimento < ? AND status = 'pendente'
      `;
      
      const [result] = await pool.query(query, [hoje]);
      console.log(`Atualizadas ${result.affectedRows} cobranças para status 'atrasado'`);
      
      return { 
        atualizadas: result.affectedRows
      };
    } catch (error) {
      console.error('Erro ao verificar cobranças vencidas:', error);
      throw error;
    }
  }

  // Buscar estatísticas por empresa
  async getStatsByEmpresa(empresaId) {
    try {
      const [statsRows] = await pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
          SUM(CASE WHEN status = 'pago' THEN 1 ELSE 0 END) as pagas,
          SUM(CASE WHEN status = 'atrasado' THEN 1 ELSE 0 END) as atrasadas,
          SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as valor_pendente,
          SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) as valor_pago,
          SUM(CASE WHEN status = 'atrasado' THEN valor ELSE 0 END) as valor_atrasado
        FROM cobrancas 
        WHERE empresa_id = ?
      `, [empresaId]);
      
      return statsRows[0];
    } catch (error) {
      console.error('Erro ao buscar estatísticas das cobranças:', error);
      throw error;
    }
  }
}

module.exports = new CobrancaModel();

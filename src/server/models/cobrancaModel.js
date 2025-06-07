
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

  // Buscar cobranças por data de vencimento específica e status opcional
  async findByVencimentoData(dataVencimento, status) {
    try {
      let query = 'SELECT * FROM cobrancas WHERE data_vencimento = ?';
      const params = [dataVencimento];
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error(`Erro ao buscar cobranças com vencimento em ${dataVencimento}:`, error);
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
  async verificarCobrancasVencidas() {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      console.log(`Verificando cobranças vencidas (antes de ${hoje})...`);
      
      // Primeiro, vamos buscar todas as cobranças pendentes com vencimento anterior à data atual
      const [cobrancasVencidas] = await pool.query(
        'SELECT id FROM cobrancas WHERE data_vencimento < ? AND status = ?',
        [hoje, 'pendente']
      );
      
      console.log(`Encontradas ${cobrancasVencidas.length} cobranças vencidas`);
      
      if (cobrancasVencidas.length === 0) {
        return { atualizadas: 0, mensagem: 'Nenhuma cobrança vencida encontrada' };
      }
      
      // Agora, atualizamos todas as cobranças vencidas para o status 'atrasado'
      const query = `
        UPDATE cobrancas
        SET status = 'atrasado'
        WHERE data_vencimento < ? AND status = 'pendente'
      `;
      
      const [result] = await pool.query(query, [hoje]);
      console.log(`Atualizadas ${result.affectedRows} cobranças para status 'atrasado'`);
      
      return { 
        atualizadas: result.affectedRows,
        cobrancasIds: cobrancasVencidas.map(c => c.id)
      };
    } catch (error) {
      console.error('Erro ao verificar cobranças vencidas:', error);
      throw error;
    }
  }

  // Recalcular o status de todas as cobranças com base em suas datas
  async recalcularStatusCobrancas() {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      console.log(`Recalculando status de todas as cobranças (data atual: ${hoje})...`);
      
      // 1. Atualizar cobranças vencidas (pendentes com data de vencimento no passado)
      const [resultVencidas] = await pool.query(
        `UPDATE cobrancas SET status = 'atrasado' 
         WHERE data_vencimento < ? AND status = 'pendente'`,
        [hoje]
      );
      
      // 2. Manter status de cobranças pagas
      // Não precisamos fazer nada, elas já estão como 'pago'
      
      // 3. Cobranças pendentes com data de vencimento futura continuam como 'pendente'
      // Também não precisamos alterar
      
      console.log(`Atualizadas ${resultVencidas.affectedRows} cobranças para 'atrasado'`);
      
      return {
        atualizadasAtrasadas: resultVencidas.affectedRows
      };
    } catch (error) {
      console.error('Erro ao recalcular status das cobranças:', error);
      throw error;
    }
  }
}

module.exports = new CobrancaModel();

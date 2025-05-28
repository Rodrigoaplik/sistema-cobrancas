
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class EmpresaModel {
  // Buscar todas as empresas
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM empresas ORDER BY nome');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  }

  // Buscar empresa por ID
  async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM empresas WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Erro ao buscar empresa com ID ${id}:`, error);
      throw error;
    }
  }

  // Buscar empresa por email
  async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM empresas WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error(`Erro ao buscar empresa com email ${email}:`, error);
      throw error;
    }
  }

  // Criar uma nova empresa
  async create(empresa) {
    try {
      const id = uuidv4();
      const query = `
        INSERT INTO empresas 
        (id, nome, email, telefone, endereco, cidade, estado, cep, status, plano, data_vencimento) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(query, [
        id,
        empresa.nome,
        empresa.email,
        empresa.telefone,
        empresa.endereco || null,
        empresa.cidade || null,
        empresa.estado || null,
        empresa.cep || null,
        empresa.status || 'ativa',
        empresa.plano || 'basico',
        empresa.data_vencimento || null
      ]);
      
      return { id, ...empresa };
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  }

  // Atualizar uma empresa existente
  async update(id, empresa) {
    try {
      const query = `
        UPDATE empresas 
        SET nome = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, 
            estado = ?, cep = ?, status = ?, plano = ?, data_vencimento = ?
        WHERE id = ?
      `;
      
      const [result] = await pool.query(query, [
        empresa.nome,
        empresa.email,
        empresa.telefone,
        empresa.endereco || null,
        empresa.cidade || null,
        empresa.estado || null,
        empresa.cep || null,
        empresa.status,
        empresa.plano,
        empresa.data_vencimento || null,
        id
      ]);
      
      if (result.affectedRows === 0) {
        throw new Error('Empresa não encontrada');
      }
      
      return { id, ...empresa };
    } catch (error) {
      console.error(`Erro ao atualizar empresa com ID ${id}:`, error);
      throw error;
    }
  }

  // Excluir uma empresa
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM empresas WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Empresa não encontrada');
      }
      
      return { id };
    } catch (error) {
      console.error(`Erro ao excluir empresa com ID ${id}:`, error);
      throw error;
    }
  }

  // Buscar estatísticas das empresas
  async getStats() {
    try {
      const [statsRows] = await pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'ativa' THEN 1 ELSE 0 END) as ativas,
          SUM(CASE WHEN status = 'inativa' THEN 1 ELSE 0 END) as inativas,
          SUM(CASE WHEN status = 'suspensa' THEN 1 ELSE 0 END) as suspensas,
          SUM(CASE WHEN data_vencimento < CURDATE() THEN 1 ELSE 0 END) as vencidas
        FROM empresas
      `);
      
      return statsRows[0];
    } catch (error) {
      console.error('Erro ao buscar estatísticas das empresas:', error);
      throw error;
    }
  }
}

module.exports = new EmpresaModel();

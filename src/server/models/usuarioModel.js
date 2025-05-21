
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class UsuarioModel {
  // Buscar todos os usuários
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT id, nome, email, role, criado_em, atualizado_em FROM usuarios ORDER BY nome');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${id}:`, error);
      throw error;
    }
  }

  // Buscar usuário por email
  async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error(`Erro ao buscar usuário com email ${email}:`, error);
      throw error;
    }
  }

  // Criar um novo usuário
  async create(usuario) {
    try {
      const id = uuidv4();
      const query = `
        INSERT INTO usuarios 
        (id, nome, email, senha_hash, role) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(query, [
        id,
        usuario.nome,
        usuario.email,
        usuario.senha_hash,
        usuario.role || 'usuario'
      ]);
      
      return { id, ...usuario };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar um usuário existente
  async update(id, usuario) {
    try {
      const query = `
        UPDATE usuarios 
        SET nome = ?, email = ?, role = ?
        ${usuario.senha_hash ? ', senha_hash = ?' : ''}
        WHERE id = ?
      `;
      
      const params = [
        usuario.nome,
        usuario.email,
        usuario.role
      ];
      
      if (usuario.senha_hash) {
        params.push(usuario.senha_hash);
      }
      
      params.push(id);
      
      const [result] = await pool.query(query, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      return { id, ...usuario };
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
      throw error;
    }
  }

  // Excluir um usuário
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      return { id };
    } catch (error) {
      console.error(`Erro ao excluir usuário com ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new UsuarioModel();


-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_cobrancas;
USE sistema_cobrancas;

-- Tabela de Empresas
CREATE TABLE IF NOT EXISTS empresas (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  endereco VARCHAR(200),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(8),
  status ENUM('ativa', 'inativa', 'suspensa') NOT NULL DEFAULT 'ativa',
  plano ENUM('basico', 'premium', 'enterprise') NOT NULL DEFAULT 'basico',
  data_vencimento DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Usuários (atualizada para multi-tenant)
CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'empresa', 'usuario') NOT NULL DEFAULT 'usuario',
  empresa_id VARCHAR(36) NULL,
  status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
);

-- Tabela de Clientes (atualizada para multi-tenant)
CREATE TABLE IF NOT EXISTS clientes (
  id VARCHAR(36) PRIMARY KEY,
  empresa_id VARCHAR(36) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  endereco VARCHAR(200) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- Tabela de Cobranças (atualizada para multi-tenant)
CREATE TABLE IF NOT EXISTS cobrancas (
  id VARCHAR(36) PRIMARY KEY,
  empresa_id VARCHAR(36) NOT NULL,
  cliente_id VARCHAR(36) NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status ENUM('pendente', 'pago', 'atrasado') NOT NULL DEFAULT 'pendente',
  data_pagamento DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Inserir usuário administrador padrão
INSERT INTO usuarios (id, nome, email, senha_hash, role) VALUES 
('admin-001', 'Administrador', 'admin@sistema.com', '$2b$10$YourHashedPasswordHere', 'admin')
ON DUPLICATE KEY UPDATE nome = nome;

-- Índices para melhorar a performance
CREATE INDEX idx_empresa_email ON empresas(email);
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_empresa ON usuarios(empresa_id);
CREATE INDEX idx_cliente_empresa ON clientes(empresa_id);
CREATE INDEX idx_cliente_email ON clientes(email);
CREATE INDEX idx_cobranca_empresa ON cobrancas(empresa_id);
CREATE INDEX idx_cobranca_cliente ON cobrancas(cliente_id);
CREATE INDEX idx_cobranca_status ON cobrancas(status);
CREATE INDEX idx_cobranca_vencimento ON cobrancas(data_vencimento);

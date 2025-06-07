
-- Criação completa do banco de dados para o Sistema de Cobranças
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

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO usuarios (id, nome, email, senha_hash, role) VALUES 
('admin-001', 'Administrador', 'admin@sistema.com', '$2b$10$YQj9YzN5K6L7M8P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2', 'admin')
ON DUPLICATE KEY UPDATE nome = nome;

-- Inserir empresa de exemplo
INSERT INTO empresas (id, nome, email, telefone, endereco, cidade, estado, cep, status, plano) VALUES 
('empresa-001', 'Empresa Exemplo', 'contato@empresaexemplo.com', '(11) 99999-9999', 'Rua Exemplo, 123', 'São Paulo', 'SP', '01234567', 'ativa', 'premium')
ON DUPLICATE KEY UPDATE nome = nome;

-- Inserir usuário da empresa de exemplo (senha: empresa123)
INSERT INTO usuarios (id, nome, email, senha_hash, role, empresa_id) VALUES 
('user-001', 'Usuário Empresa', 'usuario@empresaexemplo.com', '$2b$10$YQj9YzN5K6L7M8P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2', 'empresa', 'empresa-001')
ON DUPLICATE KEY UPDATE nome = nome;

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_empresa_email ON empresas(email);
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuario_empresa ON usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_cliente_empresa ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_cliente_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_cobranca_empresa ON cobrancas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_cobranca_cliente ON cobrancas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cobranca_status ON cobrancas(status);
CREATE INDEX IF NOT EXISTS idx_cobranca_vencimento ON cobrancas(data_vencimento);

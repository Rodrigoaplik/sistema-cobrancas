
-- ============================================
-- SISTEMA DE COBRANÇAS - SETUP COMPLETO
-- ============================================

-- Criação do banco de dados
DROP DATABASE IF EXISTS sistema_cobrancas;
CREATE DATABASE sistema_cobrancas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_cobrancas;

-- ============================================
-- TABELA DE EMPRESAS
-- ============================================
CREATE TABLE empresas (
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

-- ============================================
-- TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE usuarios (
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

-- ============================================
-- TABELA DE CLIENTES
-- ============================================
CREATE TABLE clientes (
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

-- ============================================
-- TABELA DE COBRANÇAS
-- ============================================
CREATE TABLE cobrancas (
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

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_empresa_email ON empresas(email);
CREATE INDEX idx_empresa_status ON empresas(status);
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_empresa ON usuarios(empresa_id);
CREATE INDEX idx_cliente_empresa ON clientes(empresa_id);
CREATE INDEX idx_cliente_email ON clientes(email);
CREATE INDEX idx_cobranca_empresa ON cobrancas(empresa_id);
CREATE INDEX idx_cobranca_cliente ON cobrancas(cliente_id);
CREATE INDEX idx_cobranca_status ON cobrancas(status);
CREATE INDEX idx_cobranca_vencimento ON cobrancas(data_vencimento);

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Inserir empresa exemplo
INSERT INTO empresas (id, nome, email, telefone, endereco, cidade, estado, cep, status, plano) VALUES 
('empresa-001', 'Empresa Exemplo', 'contato@empresaexemplo.com', '(11) 99999-9999', 'Rua Exemplo, 123', 'São Paulo', 'SP', '01234567', 'ativa', 'premium');

-- Inserir usuário administrador (senha: admin123)
INSERT INTO usuarios (id, nome, email, senha_hash, role) VALUES 
('admin-001', 'Administrador do Sistema', 'admin@sistema.com', '$2b$10$YQj9YzN5K6L7M8P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2', 'admin');

-- Inserir usuário da empresa (senha: empresa123)
INSERT INTO usuarios (id, nome, email, senha_hash, role, empresa_id) VALUES 
('user-001', 'Usuário da Empresa', 'usuario@empresaexemplo.com', '$2b$10$YQj9YzN5K6L7M8P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2', 'empresa', 'empresa-001');

-- Inserir clientes exemplo
INSERT INTO clientes (id, empresa_id, nome, email, telefone, whatsapp, endereco, cidade, estado, cep) VALUES 
('cliente-001', 'empresa-001', 'João Silva', 'joao@email.com', '(11) 98888-8888', '(11) 98888-8888', 'Rua das Flores, 456', 'São Paulo', 'SP', '01234567'),
('cliente-002', 'empresa-001', 'Maria Santos', 'maria@email.com', '(11) 97777-7777', '(11) 97777-7777', 'Av. Principal, 789', 'São Paulo', 'SP', '01234567'),
('cliente-003', 'empresa-001', 'Pedro Oliveira', 'pedro@email.com', '(11) 96666-6666', '(11) 96666-6666', 'Rua Secundária, 321', 'São Paulo', 'SP', '01234567');

-- Inserir cobranças exemplo
INSERT INTO cobrancas (id, empresa_id, cliente_id, descricao, valor, data_vencimento, status) VALUES 
('cobranca-001', 'empresa-001', 'cliente-001', 'Mensalidade Janeiro 2024', 250.00, '2024-01-15', 'pago'),
('cobranca-002', 'empresa-001', 'cliente-001', 'Mensalidade Fevereiro 2024', 250.00, '2024-02-15', 'pago'),
('cobranca-003', 'empresa-001', 'cliente-002', 'Mensalidade Janeiro 2024', 180.00, '2024-01-20', 'atrasado'),
('cobranca-004', 'empresa-001', 'cliente-002', 'Mensalidade Fevereiro 2024', 180.00, '2024-02-20', 'pendente'),
('cobranca-005', 'empresa-001', 'cliente-003', 'Serviço Especial', 500.00, '2024-03-01', 'pendente');

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
SELECT 'Banco criado com sucesso!' as status;
SELECT COUNT(*) as total_empresas FROM empresas;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_clientes FROM clientes;
SELECT COUNT(*) as total_cobrancas FROM cobrancas;

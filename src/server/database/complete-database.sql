
-- ============================================
-- SISTEMA DE COBRANÇAS - BANCO COMPLETO
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
-- TABELA DE NOTIFICAÇÕES
-- ============================================
CREATE TABLE notificacoes (
  id VARCHAR(36) PRIMARY KEY,
  empresa_id VARCHAR(36) NOT NULL,
  cliente_id VARCHAR(36) NOT NULL,
  cobranca_id VARCHAR(36),
  tipo ENUM('lembrete', 'vencimento', 'cobranca', 'pagamento') NOT NULL,
  canal ENUM('email', 'whatsapp', 'sms') NOT NULL DEFAULT 'email',
  destinatario VARCHAR(100) NOT NULL,
  assunto VARCHAR(200),
  mensagem TEXT NOT NULL,
  status ENUM('pendente', 'enviado', 'erro') NOT NULL DEFAULT 'pendente',
  enviado_em TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (cobranca_id) REFERENCES cobrancas(id) ON DELETE SET NULL
);

-- ============================================
-- TABELA DE LOGS DO SISTEMA
-- ============================================
CREATE TABLE logs_sistema (
  id VARCHAR(36) PRIMARY KEY,
  empresa_id VARCHAR(36),
  usuario_id VARCHAR(36),
  acao VARCHAR(100) NOT NULL,
  recurso VARCHAR(50) NOT NULL,
  recurso_id VARCHAR(36),
  detalhes JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Empresas
CREATE INDEX idx_empresa_email ON empresas(email);
CREATE INDEX idx_empresa_status ON empresas(status);
CREATE INDEX idx_empresa_plano ON empresas(plano);

-- Usuários
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_empresa ON usuarios(empresa_id);
CREATE INDEX idx_usuario_role ON usuarios(role);
CREATE INDEX idx_usuario_status ON usuarios(status);

-- Clientes
CREATE INDEX idx_cliente_empresa ON clientes(empresa_id);
CREATE INDEX idx_cliente_email ON clientes(email);
CREATE INDEX idx_cliente_nome ON clientes(nome);

-- Cobranças
CREATE INDEX idx_cobranca_empresa ON cobrancas(empresa_id);
CREATE INDEX idx_cobranca_cliente ON cobrancas(cliente_id);
CREATE INDEX idx_cobranca_status ON cobrancas(status);
CREATE INDEX idx_cobranca_vencimento ON cobrancas(data_vencimento);
CREATE INDEX idx_cobranca_status_vencimento ON cobrancas(status, data_vencimento);

-- Notificações
CREATE INDEX idx_notificacao_empresa ON notificacoes(empresa_id);
CREATE INDEX idx_notificacao_cliente ON notificacoes(cliente_id);
CREATE INDEX idx_notificacao_cobranca ON notificacoes(cobranca_id);
CREATE INDEX idx_notificacao_status ON notificacoes(status);
CREATE INDEX idx_notificacao_tipo ON notificacoes(tipo);

-- Logs
CREATE INDEX idx_log_empresa ON logs_sistema(empresa_id);
CREATE INDEX idx_log_usuario ON logs_sistema(usuario_id);
CREATE INDEX idx_log_acao ON logs_sistema(acao);
CREATE INDEX idx_log_data ON logs_sistema(created_at);

-- ============================================
-- DADOS INICIAIS - EMPRESAS
-- ============================================

INSERT INTO empresas (id, nome, email, telefone, endereco, cidade, estado, cep, status, plano, data_vencimento) VALUES 
('empresa-001', 'Empresa Exemplo LTDA', 'contato@empresaexemplo.com', '(11) 99999-9999', 'Rua Exemplo, 123 - Centro', 'São Paulo', 'SP', '01234567', 'ativa', 'premium', '2024-12-31'),
('empresa-002', 'Tech Solutions', 'admin@techsolutions.com', '(11) 98888-8888', 'Av. Paulista, 1000 - Bela Vista', 'São Paulo', 'SP', '01310100', 'ativa', 'enterprise', '2024-11-30'),
('empresa-003', 'Consultoria XYZ', 'contato@consultoriaxyz.com', '(21) 97777-7777', 'Rua das Laranjeiras, 200', 'Rio de Janeiro', 'RJ', '22240000', 'ativa', 'basico', '2024-10-15');

-- ============================================
-- DADOS INICIAIS - USUÁRIOS
-- ============================================

-- Usuário administrador do sistema (senha: admin123)
INSERT INTO usuarios (id, nome, email, senha_hash, role, empresa_id, status) VALUES 
('admin-001', 'Administrador do Sistema', 'admin@sistema.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, 'ativo');

-- Usuários das empresas (senha: empresa123)
INSERT INTO usuarios (id, nome, email, senha_hash, role, empresa_id, status) VALUES 
('user-001', 'João Silva', 'usuario@empresaexemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empresa', 'empresa-001', 'ativo'),
('user-002', 'Maria Santos', 'maria@empresaexemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario', 'empresa-001', 'ativo'),
('user-003', 'Carlos Oliveira', 'carlos@techsolutions.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empresa', 'empresa-002', 'ativo'),
('user-004', 'Ana Costa', 'ana@consultoriaxyz.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empresa', 'empresa-003', 'ativo');

-- ============================================
-- DADOS INICIAIS - CLIENTES
-- ============================================

-- Clientes da Empresa 001
INSERT INTO clientes (id, empresa_id, nome, email, telefone, whatsapp, endereco, cidade, estado, cep) VALUES 
('cliente-001', 'empresa-001', 'Pedro Henrique', 'pedro@email.com', '(11) 98888-8888', '(11) 98888-8888', 'Rua das Flores, 456', 'São Paulo', 'SP', '01234567'),
('cliente-002', 'empresa-001', 'Maria Fernanda', 'maria.fernanda@email.com', '(11) 97777-7777', '(11) 97777-7777', 'Av. Principal, 789', 'São Paulo', 'SP', '01234567'),
('cliente-003', 'empresa-001', 'José Antonio', 'jose.antonio@email.com', '(11) 96666-6666', '(11) 96666-6666', 'Rua Secundária, 321', 'São Paulo', 'SP', '01234567'),
('cliente-004', 'empresa-001', 'Ana Clara', 'ana.clara@email.com', '(11) 95555-5555', '(11) 95555-5555', 'Alameda dos Sonhos, 100', 'São Paulo', 'SP', '01234567'),

-- Clientes da Empresa 002
('cliente-005', 'empresa-002', 'Roberto Silva', 'roberto@techclient.com', '(11) 94444-4444', '(11) 94444-4444', 'Rua da Tecnologia, 500', 'São Paulo', 'SP', '01310100'),
('cliente-006', 'empresa-002', 'Fernanda Lima', 'fernanda@innovate.com', '(11) 93333-3333', '(11) 93333-3333', 'Av. Inovação, 750', 'São Paulo', 'SP', '01310100'),

-- Clientes da Empresa 003
('cliente-007', 'empresa-003', 'Marcos Pereira', 'marcos@cliente.com', '(21) 92222-2222', '(21) 92222-2222', 'Rua Copacabana, 800', 'Rio de Janeiro', 'RJ', '22240000'),
('cliente-008', 'empresa-003', 'Lucia Santos', 'lucia@empresa.com', '(21) 91111-1111', '(21) 91111-1111', 'Av. Atlântica, 1200', 'Rio de Janeiro', 'RJ', '22240000');

-- ============================================
-- DADOS INICIAIS - COBRANÇAS
-- ============================================

-- Cobranças da Empresa 001
INSERT INTO cobrancas (id, empresa_id, cliente_id, descricao, valor, data_vencimento, status, data_pagamento) VALUES 
('cobranca-001', 'empresa-001', 'cliente-001', 'Mensalidade Janeiro 2024', 250.00, '2024-01-15', 'pago', '2024-01-10'),
('cobranca-002', 'empresa-001', 'cliente-001', 'Mensalidade Fevereiro 2024', 250.00, '2024-02-15', 'pago', '2024-02-12'),
('cobranca-003', 'empresa-001', 'cliente-001', 'Mensalidade Março 2024', 250.00, '2024-03-15', 'pendente', NULL),
('cobranca-004', 'empresa-001', 'cliente-002', 'Mensalidade Janeiro 2024', 180.00, '2024-01-20', 'atrasado', NULL),
('cobranca-005', 'empresa-001', 'cliente-002', 'Mensalidade Fevereiro 2024', 180.00, '2024-02-20', 'pendente', NULL),
('cobranca-006', 'empresa-001', 'cliente-003', 'Serviço Especial', 500.00, '2024-03-01', 'pendente', NULL),
('cobranca-007', 'empresa-001', 'cliente-004', 'Consultoria Março', 350.00, '2024-03-10', 'pago', '2024-03-08'),

-- Cobranças da Empresa 002
('cobranca-008', 'empresa-002', 'cliente-005', 'Desenvolvimento Sistema', 2500.00, '2024-02-28', 'pago', '2024-02-25'),
('cobranca-009', 'empresa-002', 'cliente-005', 'Manutenção Mensal', 800.00, '2024-03-15', 'pendente', NULL),
('cobranca-010', 'empresa-002', 'cliente-006', 'Licença Software', 1200.00, '2024-03-20', 'pendente', NULL),

-- Cobranças da Empresa 003
('cobranca-011', 'empresa-003', 'cliente-007', 'Consultoria Estratégica', 900.00, '2024-02-10', 'atrasado', NULL),
('cobranca-012', 'empresa-003', 'cliente-008', 'Auditoria Financeira', 1500.00, '2024-03-05', 'pendente', NULL);

-- ============================================
-- DADOS INICIAIS - NOTIFICAÇÕES
-- ============================================

INSERT INTO notificacoes (id, empresa_id, cliente_id, cobranca_id, tipo, canal, destinatario, assunto, mensagem, status, enviado_em) VALUES 
('notif-001', 'empresa-001', 'cliente-002', 'cobranca-004', 'cobranca', 'email', 'maria.fernanda@email.com', 'Cobrança em Atraso', 'Sua cobrança de R$ 180,00 está em atraso. Por favor, regularize.', 'enviado', '2024-02-25 10:00:00'),
('notif-002', 'empresa-001', 'cliente-003', 'cobranca-006', 'lembrete', 'whatsapp', '(11) 96666-6666', 'Lembrete de Vencimento', 'Sua cobrança vence em 3 dias. Valor: R$ 500,00', 'enviado', '2024-02-26 14:30:00'),
('notif-003', 'empresa-002', 'cliente-005', 'cobranca-008', 'pagamento', 'email', 'roberto@techclient.com', 'Pagamento Confirmado', 'Confirmamos o recebimento do pagamento de R$ 2.500,00', 'enviado', '2024-02-25 16:45:00');

-- ============================================
-- DADOS INICIAIS - LOGS DO SISTEMA
-- ============================================

INSERT INTO logs_sistema (id, empresa_id, usuario_id, acao, recurso, recurso_id, detalhes, ip_address, user_agent) VALUES 
('log-001', 'empresa-001', 'user-001', 'CREATE', 'cobranca', 'cobranca-006', '{"valor": 500.00, "cliente": "José Antonio"}', '192.168.1.100', 'Mozilla/5.0'),
('log-002', 'empresa-001', 'user-001', 'UPDATE', 'cobranca', 'cobranca-007', '{"status_anterior": "pendente", "status_novo": "pago"}', '192.168.1.100', 'Mozilla/5.0'),
('log-003', 'empresa-002', 'user-003', 'CREATE', 'cliente', 'cliente-006', '{"nome": "Fernanda Lima"}', '192.168.1.200', 'Chrome/90.0'),
('log-004', NULL, 'admin-001', 'CREATE', 'empresa', 'empresa-003', '{"nome": "Consultoria XYZ"}', '192.168.1.50', 'Mozilla/5.0');

-- ============================================
-- PROCEDURES E TRIGGERS
-- ============================================

-- Procedure para atualizar status das cobranças vencidas
DELIMITER $$
CREATE PROCEDURE AtualizarCobrancasVencidas()
BEGIN
    UPDATE cobrancas 
    SET status = 'atrasado' 
    WHERE data_vencimento < CURDATE() 
    AND status = 'pendente';
    
    SELECT ROW_COUNT() as cobrancas_atualizadas;
END$$
DELIMITER ;

-- Trigger para log automático
DELIMITER $$
CREATE TRIGGER log_cobranca_update 
AFTER UPDATE ON cobrancas
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO logs_sistema (id, empresa_id, acao, recurso, recurso_id, detalhes)
        VALUES (UUID(), NEW.empresa_id, 'UPDATE_STATUS', 'cobranca', NEW.id, 
                JSON_OBJECT('status_anterior', OLD.status, 'status_novo', NEW.status));
    END IF;
END$$
DELIMITER ;

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View para dashboard das empresas
CREATE VIEW vw_dashboard_empresa AS
SELECT 
    e.id as empresa_id,
    e.nome as empresa_nome,
    COUNT(DISTINCT c.id) as total_clientes,
    COUNT(DISTINCT co.id) as total_cobrancas,
    SUM(CASE WHEN co.status = 'pendente' THEN co.valor ELSE 0 END) as valor_pendente,
    SUM(CASE WHEN co.status = 'pago' THEN co.valor ELSE 0 END) as valor_recebido,
    SUM(CASE WHEN co.status = 'atrasado' THEN co.valor ELSE 0 END) as valor_atrasado
FROM empresas e
LEFT JOIN clientes c ON e.id = c.empresa_id
LEFT JOIN cobrancas co ON e.id = co.empresa_id
GROUP BY e.id, e.nome;

-- View para relatório de cobranças
CREATE VIEW vw_relatorio_cobrancas AS
SELECT 
    co.id,
    e.nome as empresa_nome,
    c.nome as cliente_nome,
    c.email as cliente_email,
    co.descricao,
    co.valor,
    co.data_vencimento,
    co.status,
    co.data_pagamento,
    DATEDIFF(CURDATE(), co.data_vencimento) as dias_vencimento
FROM cobrancas co
JOIN clientes c ON co.cliente_id = c.id
JOIN empresas e ON co.empresa_id = e.id;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

SELECT 'Banco de dados criado com sucesso!' as status;
SELECT COUNT(*) as total_empresas FROM empresas;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_clientes FROM clientes;
SELECT COUNT(*) as total_cobrancas FROM cobrancas;
SELECT COUNT(*) as total_notificacoes FROM notificacoes;

-- Estatísticas por empresa
SELECT 
    e.nome as empresa,
    COUNT(DISTINCT c.id) as clientes,
    COUNT(DISTINCT co.id) as cobrancas,
    SUM(co.valor) as valor_total
FROM empresas e
LEFT JOIN clientes c ON e.id = c.empresa_id
LEFT JOIN cobrancas co ON e.id = co.empresa_id
GROUP BY e.id, e.nome;

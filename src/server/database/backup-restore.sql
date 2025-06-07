
-- ============================================
-- SCRIPTS DE BACKUP E RESTAURAÇÃO
-- ============================================

-- Para fazer backup (execute no terminal):
-- mysqldump -u root -p sistema_cobrancas > backup_sistema_cobrancas.sql

-- Para restaurar (execute no terminal):
-- mysql -u root -p sistema_cobrancas < backup_sistema_cobrancas.sql

-- ============================================
-- COMANDOS ÚTEIS DE MANUTENÇÃO
-- ============================================

-- Verificar tamanho das tabelas
SELECT 
    table_name AS 'Tabela',
    round(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'sistema_cobrancas'
ORDER BY (data_length + index_length) DESC;

-- Verificar integridade referencial
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = 'sistema_cobrancas';

-- Otimizar todas as tabelas
OPTIMIZE TABLE empresas, usuarios, clientes, cobrancas, notificacoes, logs_sistema;

-- Analisar performance das consultas mais usadas
EXPLAIN SELECT * FROM vw_dashboard_empresa;
EXPLAIN SELECT * FROM vw_relatorio_cobrancas WHERE status = 'pendente';

-- Limpeza de logs antigos (manter apenas últimos 90 dias)
DELETE FROM logs_sistema 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Atualizar estatísticas das tabelas
ANALYZE TABLE empresas, usuarios, clientes, cobrancas, notificacoes, logs_sistema;

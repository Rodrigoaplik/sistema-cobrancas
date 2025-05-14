
import React from 'react';
import EnviarNotificacaoModal from './EnviarNotificacaoModal';

interface EnviarNotificacaoButtonProps {
  clienteId: string;
  cobrancaId: string;
  clienteNome?: string;
  valorCobranca?: number;
  descricaoCobranca?: string;
  dataVencimento?: Date | string;
  disabled?: boolean;
  tipo?: 'aviso_vencimento' | 'cobranca_vencida';
  onSuccess?: () => void;
}

const EnviarNotificacaoButton = ({ 
  clienteId, 
  cobrancaId,
  clienteNome,
  valorCobranca,
  descricaoCobranca,
  dataVencimento,
  disabled = false,
  tipo = 'aviso_vencimento',
  onSuccess 
}: EnviarNotificacaoButtonProps) => {
  return (
    <EnviarNotificacaoModal
      clienteId={clienteId}
      cobrancaId={cobrancaId}
      clienteNome={clienteNome}
      valorCobranca={valorCobranca}
      descricaoCobranca={descricaoCobranca}
      dataVencimento={dataVencimento}
      onSuccess={onSuccess}
    />
  );
};

export default EnviarNotificacaoButton;

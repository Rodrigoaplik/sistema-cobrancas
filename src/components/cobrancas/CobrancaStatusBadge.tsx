
import React from 'react';

const statusClasses = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
  pago: "bg-green-100 text-green-800 border-green-300",
  atrasado: "bg-red-100 text-red-800 border-red-300"
};

interface CobrancaStatusBadgeProps {
  status: 'pendente' | 'pago' | 'atrasado' | string | null | undefined;
}

const CobrancaStatusBadge = ({ status }: CobrancaStatusBadgeProps) => {
  // Verificar se o status é válido
  if (!status || !['pendente', 'pago', 'atrasado'].includes(status)) {
    return <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-800">
      Desconhecido
    </span>;
  }

  const validStatus = status as 'pendente' | 'pago' | 'atrasado';
  
  const statusText = {
    pendente: "Pendente",
    pago: "Pago",
    atrasado: "Atrasado"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[validStatus]}`}>
      {statusText[validStatus]}
    </span>
  );
};

export default CobrancaStatusBadge;

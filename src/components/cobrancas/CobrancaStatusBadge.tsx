
import React from 'react';

const statusClasses = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
  pago: "bg-green-100 text-green-800 border-green-300",
  atrasado: "bg-red-100 text-red-800 border-red-300"
};

interface CobrancaStatusBadgeProps {
  status: 'pendente' | 'pago' | 'atrasado';
}

const CobrancaStatusBadge = ({ status }: CobrancaStatusBadgeProps) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default CobrancaStatusBadge;

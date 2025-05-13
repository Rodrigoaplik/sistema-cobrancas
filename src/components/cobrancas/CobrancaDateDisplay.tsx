
import React from 'react';
import { formatRelative, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CobrancaDateDisplayProps {
  date: Date;
}

const CobrancaDateDisplay = ({ date }: CobrancaDateDisplayProps) => {
  const formatarData = (data: Date) => {
    return format(new Date(data), "dd/MM/yyyy");
  };

  const formatarDataRelativa = (data: Date) => {
    return formatRelative(new Date(data), new Date(), { locale: ptBR });
  };

  return (
    <div>
      <div>{formatarData(date)}</div>
      <div className="text-xs text-gray-500">
        {formatarDataRelativa(date)}
      </div>
    </div>
  );
};

export default CobrancaDateDisplay;

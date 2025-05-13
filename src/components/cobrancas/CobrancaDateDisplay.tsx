
import React from 'react';
import { formatRelative, format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CobrancaDateDisplayProps {
  date: Date | string | null | undefined;
}

const CobrancaDateDisplay = ({ date }: CobrancaDateDisplayProps) => {
  // Verificar se a data é válida
  if (!date) {
    return <div className="text-gray-500 text-sm">Data inválida</div>;
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Verificar se a data é válida após conversão
  if (!isValid(dateObj)) {
    return <div className="text-gray-500 text-sm">Data inválida</div>;
  }

  const formatarData = (data: Date) => {
    return format(data, "dd/MM/yyyy");
  };

  const formatarDataRelativa = (data: Date) => {
    try {
      return formatRelative(data, new Date(), { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data relativa:", error);
      return "Data inválida";
    }
  };

  return (
    <div>
      <div>{formatarData(dateObj)}</div>
      <div className="text-xs text-gray-500">
        {formatarDataRelativa(dateObj)}
      </div>
    </div>
  );
};

export default CobrancaDateDisplay;

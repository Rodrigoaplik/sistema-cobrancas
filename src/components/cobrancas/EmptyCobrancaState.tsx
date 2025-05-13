
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EmptyCobrancaStateProps {
  clienteId: string;
}

const EmptyCobrancaState = ({ clienteId }: EmptyCobrancaStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <p className="text-gray-500">Nenhuma cobrança encontrada para este cliente.</p>
      <Button 
        onClick={() => navigate(`/clientes/${clienteId}/cobrancas/novo`)}
        className="mt-4"
      >
        Criar Nova Cobrança
      </Button>
    </div>
  );
};

export default EmptyCobrancaState;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, Plus } from 'lucide-react';

interface EmptyCobrancaStateProps {
  clienteId: string;
}

const EmptyCobrancaState = ({ clienteId }: EmptyCobrancaStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border rounded-lg">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhuma cobrança encontrada</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Este cliente ainda não possui nenhuma cobrança registrada. Crie a primeira cobrança agora mesmo.
      </p>
      <Button asChild>
        <Link to={`/clientes/${clienteId}/cobrancas/nova`}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Cobrança
        </Link>
      </Button>
    </div>
  );
};

export default EmptyCobrancaState;

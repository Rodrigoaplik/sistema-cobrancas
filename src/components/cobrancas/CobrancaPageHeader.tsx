
import React from 'react';
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CobrancaPageHeaderProps {
  clienteName?: string;
  clienteId: string;
  isVerificandoVencimentos: boolean;
  onVerificarVencimentos: () => void;
  onRefresh: () => void;
}

const CobrancaPageHeader = ({
  clienteName,
  clienteId,
  isVerificandoVencimentos,
  onVerificarVencimentos,
  onRefresh
}: CobrancaPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">Cobranças</h1>
        {clienteName && (
          <p className="text-gray-500">
            Cliente: {clienteName}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onVerificarVencimentos} 
          variant="outline"
          disabled={isVerificandoVencimentos}
        >
          {isVerificandoVencimentos ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Verificar Vencimentos
            </>
          )}
        </Button>
        <Button 
          onClick={onRefresh} 
          variant="outline"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Atualizar Lista
        </Button>
        <Button 
          onClick={() => navigate(`/clientes/${clienteId}/cobrancas/novo`)}
        >
          Nova Cobrança
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/clientes")}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default CobrancaPageHeader;


import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CobrancaForm from "@/components/CobrancaForm";
import { Cobranca } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import clienteService from "@/services/clienteService";
import cobrancaService from "@/services/cobrancaService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CobrancaFormPage = () => {
  const { clienteId, cobrancaId } = useParams<{ clienteId: string; cobrancaId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Buscar cliente com React Query
  const { 
    data: cliente,
    isLoading: isLoadingCliente,
    error: clienteError
  } = useQuery({
    queryKey: ["cliente", clienteId],
    queryFn: () => clienteId ? clienteService.buscarCliente(clienteId) : null,
    enabled: !!clienteId,
  });

  // Notificar erro de cliente não encontrado
  useEffect(() => {
    if (clienteError) {
      toast({
        title: "Cliente não encontrado",
        description: "O cliente solicitado não foi encontrado.",
        variant: "destructive",
      });
      navigate("/clientes");
    }
  }, [clienteError, toast, navigate]);

  // Buscar cobrança com React Query (apenas se for edição)
  const { 
    data: cobranca, 
    isLoading: isLoadingCobranca,
    error: cobrancaError
  } = useQuery({
    queryKey: ["cobranca", cobrancaId],
    queryFn: () => cobrancaId ? cobrancaService.buscarCobranca(cobrancaId) : null,
    enabled: !!cobrancaId,
  });

  // Notificar erro de cobrança não encontrada
  useEffect(() => {
    if (cobrancaError) {
      toast({
        title: "Cobrança não encontrada",
        description: "A cobrança solicitada não foi encontrada.",
        variant: "destructive",
      });
      navigate(`/clientes/${clienteId}/cobrancas`);
    }
  }, [cobrancaError, toast, navigate, clienteId]);

  // Mutação para criar cobrança
  const criarCobrancaMutation = useMutation({
    mutationFn: ({ clienteId, data }: { clienteId: string; data: Cobranca }) => 
      cobrancaService.criarCobranca(clienteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Cobrança salva com sucesso!",
        description: "Os dados da cobrança foram salvos.",
      });
      navigate(`/clientes/${clienteId}/cobrancas`);
    },
    onError: (error: any) => {
      console.error("Erro ao criar cobrança:", error);
      toast({
        title: "Erro ao criar cobrança",
        description: error.response?.data?.mensagem || "Ocorreu um erro ao criar a cobrança.",
        variant: "destructive",
      });
    }
  });

  // Mutação para atualizar cobrança
  const atualizarCobrancaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Cobranca }) => 
      cobrancaService.atualizarCobranca(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      queryClient.invalidateQueries({ queryKey: ["cobranca", cobrancaId] });
      toast({
        title: "Cobrança atualizada com sucesso!",
        description: "Os dados da cobrança foram atualizados.",
      });
      navigate(`/clientes/${clienteId}/cobrancas`);
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar cobrança:", error);
      toast({
        title: "Erro ao atualizar cobrança",
        description: error.response?.data?.mensagem || "Ocorreu um erro ao atualizar a cobrança.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (data: Cobranca) => {
    if (!clienteId) return;
    
    console.log("Submetendo cobrança:", data);
    
    // Garantir que o status seja um dos valores válidos do tipo
    const status = data.status as 'pendente' | 'pago' | 'atrasado';
    const cobrancaData = { ...data, status };
    
    if (cobrancaId) {
      atualizarCobrancaMutation.mutate({ id: cobrancaId, data: cobrancaData });
    } else {
      criarCobrancaMutation.mutate({ clienteId, data: cobrancaData });
    }
  };

  const isLoading = isLoadingCliente || (cobrancaId ? isLoadingCobranca : false);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {cobrancaId ? "Editar Cobrança" : "Nova Cobrança"}
          </h1>
          {cliente && (
            <p className="text-gray-500">
              Cliente: {cliente.nome}
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/clientes/${clienteId}/cobrancas`)}
        >
          Voltar
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando dados da cobrança...</p>
          </div>
        ) : clienteId ? (
          <CobrancaForm 
            clienteId={clienteId}
            cobranca={cobranca}
            onSubmit={handleSubmit}
            isSubmitting={criarCobrancaMutation.isPending || atualizarCobrancaMutation.isPending}
          />
        ) : (
          <p className="text-center text-red-500">Cliente não identificado</p>
        )}
      </div>
    </div>
  );
};

export default CobrancaFormPage;

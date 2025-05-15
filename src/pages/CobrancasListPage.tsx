
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import clienteService from "@/services/clienteService";
import cobrancaService from "@/services/cobrancaService";
import CobrancaPageHeader from "@/components/cobrancas/CobrancaPageHeader";
import CobrancaTable from "@/components/cobrancas/CobrancaTable";
import EmptyCobrancaState from "@/components/cobrancas/EmptyCobrancaState";

const CobrancasListPage = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isVerificandoVencimentos, setIsVerificandoVencimentos] = useState(false);

  const {
    data: cliente,
    isLoading: isLoadingCliente,
    error: clienteError
  } = useQuery({
    queryKey: ["cliente", clienteId],
    queryFn: () => clienteId ? clienteService.buscarCliente(clienteId) : null,
    enabled: !!clienteId,
  });

  const {
    data: cobrancas = [],
    isLoading: isLoadingCobrancas,
    error: cobrancasError,
    refetch: refetchCobrancas
  } = useQuery({
    queryKey: ["cobrancas", clienteId],
    queryFn: () => clienteId ? cobrancaService.listarCobrancasPorCliente(clienteId) : [],
    enabled: !!clienteId,
  });

  const verificarVencimentosMutation = useMutation({
    mutationFn: () => cobrancaService.verificarCobrancasVencidas(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Verificação de vencimentos concluída",
        description: `${data.atualizadas || 0} cobrança(s) atualizada(s) para status 'atrasado'`,
      });
      setIsVerificandoVencimentos(false);
    },
    onSettled: () => {
      setIsVerificandoVencimentos(false);
    }
  });

  // Verificação automática de status quando a página carrega
  useEffect(() => {
    const verificarAutomaticamente = async () => {
      if (clienteId) {
        try {
          await cobrancaService.verificarStatusAutomaticamente();
          // Não recarregamos os dados aqui, pois o próprio serviço já faz isso
        } catch (error) {
          console.error("Erro na verificação automática:", error);
        }
      }
    };

    verificarAutomaticamente();
    
    // Configurar verificação periódica a cada 5 minutos
    const intervalId = setInterval(verificarAutomaticamente, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [clienteId, queryClient]);

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

  // Notificar erro de cobranças
  useEffect(() => {
    if (cobrancasError) {
      toast({
        title: "Erro ao carregar cobranças",
        description: "Não foi possível carregar as cobranças do cliente.",
        variant: "destructive",
      });
    }
  }, [cobrancasError, toast]);

  const handleVerificarVencimentos = () => {
    setIsVerificandoVencimentos(true);
    verificarVencimentosMutation.mutate();
  };

  return (
    <div className="container mx-auto py-10">
      <CobrancaPageHeader 
        clienteName={cliente?.nome}
        clienteId={clienteId!}
        isVerificandoVencimentos={isVerificandoVencimentos}
        onVerificarVencimentos={handleVerificarVencimentos}
        onRefresh={() => refetchCobrancas()}
      />

      {isLoadingCliente || isLoadingCobrancas ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados...</p>
        </div>
      ) : cobrancas.length === 0 ? (
        <EmptyCobrancaState clienteId={clienteId!} />
      ) : (
        <CobrancaTable cobrancas={cobrancas} clienteId={clienteId!} />
      )}
    </div>
  );
};

export default CobrancasListPage;

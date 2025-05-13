import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatRelative, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Pencil, Trash2, FileText, Check, X, Bell, RefreshCcw, Loader 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import clienteService from "@/services/clienteService";
import cobrancaService from "@/services/cobrancaService";
import notificacaoService from "@/services/notificacaoService";
import EnviarNotificacaoButton from "@/components/EnviarNotificacaoButton";

const statusClasses = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
  pago: "bg-green-100 text-green-800 border-green-300",
  atrasado: "bg-red-100 text-red-800 border-red-300"
};

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

  const excluirCobrancaMutation = useMutation({
    mutationFn: (id: string) => cobrancaService.excluirCobranca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Cobrança excluída com sucesso!",
        description: "A cobrança foi removida permanentemente.",
      });
    }
  });

  const atualizarStatusMutation = useMutation({
    mutationFn: ({id, status, dataPagamento}: {id: string, status: 'pendente' | 'pago' | 'atrasado', dataPagamento?: Date}) => 
      cobrancaService.atualizarStatus(id, status, dataPagamento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Status atualizado com sucesso!",
        description: "O status da cobrança foi atualizado.",
      });
    }
  });

  const verificarVencimentosMutation = useMutation({
    mutationFn: () => notificacaoService.verificarCobrancasParaNotificar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Verificação de vencimentos concluída",
        description: "As notificações foram enviadas conforme necessário.",
      });
      setIsVerificandoVencimentos(false);
    },
    onSettled: () => {
      setIsVerificandoVencimentos(false);
    }
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

  const handleMarcarPago = (id: string) => {
    atualizarStatusMutation.mutate({
      id, 
      status: 'pago', 
      dataPagamento: new Date()
    });
  };

  const handleMarcarPendente = (id: string) => {
    atualizarStatusMutation.mutate({
      id, 
      status: 'pendente'
    });
  };

  const handleVerificarVencimentos = () => {
    setIsVerificandoVencimentos(true);
    verificarVencimentosMutation.mutate();
  };

  const formatarData = (data: Date) => {
    return format(new Date(data), "dd/MM/yyyy");
  };

  const formatarDataRelativa = (data: Date) => {
    return formatRelative(new Date(data), new Date(), { locale: ptBR });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cobranças</h1>
          {cliente && (
            <p className="text-gray-500">
              Cliente: {cliente.nome}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleVerificarVencimentos} 
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
            onClick={() => refetchCobrancas()} 
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

      {isLoadingCliente || isLoadingCobrancas ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados...</p>
        </div>
      ) : cobrancas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Nenhuma cobrança encontrada para este cliente.</p>
          <Button 
            onClick={() => navigate(`/clientes/${clienteId}/cobrancas/novo`)}
            className="mt-4"
          >
            Criar Nova Cobrança
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cobrancas.map((cobranca) => (
                <TableRow key={cobranca.id}>
                  <TableCell className="font-medium">{cobranca.descricao}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(cobranca.valor)}
                  </TableCell>
                  <TableCell>
                    <div>{formatarData(cobranca.dataVencimento)}</div>
                    <div className="text-xs text-gray-500">
                      {formatarDataRelativa(cobranca.dataVencimento)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[cobranca.status]}`}>
                      {cobranca.status.charAt(0).toUpperCase() + cobranca.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {cobranca.dataPagamento ? (
                      <div>
                        <div>{formatarData(cobranca.dataPagamento)}</div>
                        <div className="text-xs text-gray-500">
                          {formatarDataRelativa(cobranca.dataPagamento)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Não pago</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-1">
                    {cobranca.status !== 'pago' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarcarPago(cobranca.id!)}
                        title="Marcar como pago"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {cobranca.status === 'pago' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarcarPendente(cobranca.id!)}
                        title="Marcar como pendente"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                    <EnviarNotificacaoButton
                      clienteId={clienteId!}
                      cobrancaId={cobranca.id!}
                      tipo={cobranca.status === 'atrasado' ? 'cobranca_vencida' : 'aviso_vencimento'}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/clientes/${clienteId}/cobrancas/${cobranca.id}`)}
                      title="Editar cobrança"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-red-500"
                          title="Excluir cobrança"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Cobrança</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta cobrança?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => excluirCobrancaMutation.mutate(cobranca.id!)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CobrancasListPage;


import { Pencil, Trash2, Check, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import cobrancaService from "@/services/cobrancaService";
import { Cobranca } from "@/types";
import EnviarNotificacaoButton from "@/components/EnviarNotificacaoButton";

interface CobrancaActionButtonsProps {
  cobranca: Cobranca;
  clienteId: string;
}

const CobrancaActionButtons = ({ cobranca, clienteId }: CobrancaActionButtonsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const excluirCobrancaMutation = useMutation({
    mutationFn: (id: string) => cobrancaService.excluirCobranca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Cobrança excluída com sucesso!",
        description: "A cobrança foi removida permanentemente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir cobrança",
        description: error.response?.data?.mensagem || "Ocorreu um erro ao excluir a cobrança.",
        variant: "destructive",
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
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.response?.data?.mensagem || "Ocorreu um erro ao atualizar o status da cobrança.",
        variant: "destructive",
      });
    }
  });

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

  return (
    <div className="flex justify-end gap-1">
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/clientes/${clienteId}/cobrancas/editar/${cobranca.id}`)}
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
      <EnviarNotificacaoButton
        clienteId={clienteId}
        cobrancaId={cobranca.id!}
        tipo={cobranca.status === 'atrasado' ? 'cobranca_vencida' : 'aviso_vencimento'}
      />
    </div>
  );
};

export default CobrancaActionButtons;

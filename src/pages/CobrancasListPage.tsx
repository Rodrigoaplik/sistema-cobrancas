
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Cobranca } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import clienteService from "@/services/clienteService";
import cobrancaService from "@/services/cobrancaService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CobrancasListPage = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
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
    }
  }, [clienteError, toast]);
  
  // Buscar cobranças do cliente com React Query
  const {
    data: cobrancas = [],
    isLoading: isLoadingCobrancas,
    error: cobrancasError
  } = useQuery({
    queryKey: ["cobrancas", clienteId],
    queryFn: () => clienteId ? cobrancaService.listarCobrancasPorCliente(clienteId) : [],
    enabled: !!clienteId,
  });
  
  // Notificar erro ao carregar cobranças
  useEffect(() => {
    if (cobrancasError) {
      toast({
        title: "Erro ao carregar cobranças",
        description: "Não foi possível carregar a lista de cobranças.",
        variant: "destructive",
      });
    }
  }, [cobrancasError, toast]);

  // Mutação para excluir cobrança
  const excluirCobrancaMutation = useMutation({
    mutationFn: cobrancaService.excluirCobranca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Cobrança excluída",
        description: "A cobrança foi excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir cobrança",
        description: error.response?.data?.mensagem || "Não foi possível excluir a cobrança.",
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar status da cobrança
  const atualizarStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      cobrancaService.atualizarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobrancas", clienteId] });
      toast({
        title: "Status atualizado",
        description: "O status da cobrança foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.response?.data?.mensagem || "Não foi possível atualizar o status da cobrança.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCobranca = (id: string) => {
    if (window.confirm("Deseja realmente excluir esta cobrança?")) {
      excluirCobrancaMutation.mutate(id);
    }
  };

  const handleUpdateStatus = (id: string, novoStatus: "pendente" | "pago" | "atrasado") => {
    atualizarStatusMutation.mutate({ id, status: novoStatus });
  };
  
  // Formatar data
  const formatarData = (data: Date | string | undefined) => {
    if (!data) return "-";
    return format(new Date(data), "dd/MM/yyyy");
  };

  const isLoading = isLoadingCliente || isLoadingCobrancas;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cobranças</h1>
          {cliente && (
            <p className="text-gray-500">
              Cliente: {cliente.nome}
            </p>
          )}
        </div>
        <div className="space-x-2">
          {clienteId && (
            <Button asChild>
              <Link to={`/clientes/${clienteId}/cobrancas/nova`}>
                Nova Cobrança
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/clientes">Voltar para Clientes</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando cobranças...</p>
        </div>
      ) : cobrancas.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-lg text-gray-500">Nenhuma cobrança cadastrada</p>
          {clienteId && (
            <Button asChild className="mt-4">
              <Link to={`/clientes/${clienteId}/cobrancas/nova`}>
                Cadastrar Nova Cobrança
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
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
                  <TableCell className="font-medium">
                    {cobranca.descricao}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(cobranca.valor)}
                  </TableCell>
                  <TableCell>{formatarData(cobranca.dataVencimento)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cobranca.status === "pago"
                            ? "bg-green-100 text-green-800"
                            : cobranca.status === "atrasado"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {cobranca.status === "pago"
                          ? "Pago"
                          : cobranca.status === "atrasado"
                          ? "Atrasado"
                          : "Pendente"}
                      </span>

                      <select
                        className="text-xs border rounded"
                        value={cobranca.status}
                        onChange={(e) => {
                          if (cobranca.id) {
                            handleUpdateStatus(cobranca.id, e.target.value as "pendente" | "pago" | "atrasado");
                          }
                        }}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="atrasado">Atrasado</option>
                      </select>
                    </div>
                  </TableCell>
                  <TableCell>
                    {cobranca.dataPagamento ? formatarData(cobranca.dataPagamento) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link
                          to={`/clientes/${clienteId}/cobrancas/editar/${cobranca.id}`}
                        >
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cobranca.id && handleDeleteCobranca(cobranca.id)}
                      >
                        Excluir
                      </Button>
                    </div>
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

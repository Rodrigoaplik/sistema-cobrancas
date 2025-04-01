
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClienteForm from "@/components/ClienteForm";
import { Cliente } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import clienteService from "@/services/clienteService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ClienteFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar dados do cliente com React Query (apenas se for edição)
  const { 
    data: cliente, 
    isLoading 
  } = useQuery({
    queryKey: ["cliente", id],
    queryFn: () => id ? clienteService.buscarCliente(id) : null,
    enabled: !!id,
  });

  // Mutação para criar cliente
  const criarClienteMutation = useMutation({
    mutationFn: clienteService.criarCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      toast({
        title: "Cliente salvo com sucesso!",
        description: "Os dados do cliente foram salvos.",
      });
      navigate("/clientes");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar cliente",
        description: error.response?.data?.mensagem || "Ocorreu um erro ao salvar os dados do cliente.",
        variant: "destructive",
      });
    },
  });

  // Mutação para atualizar cliente
  const atualizarClienteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Cliente }) => 
      clienteService.atualizarCliente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["cliente", id] });
      toast({
        title: "Cliente atualizado com sucesso!",
        description: "Os dados do cliente foram atualizados.",
      });
      navigate("/clientes");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.response?.data?.mensagem || "Ocorreu um erro ao atualizar os dados do cliente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: Cliente) => {
    if (id) {
      atualizarClienteMutation.mutate({ id, data });
    } else {
      criarClienteMutation.mutate(data);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? "Editar Cliente" : "Novo Cliente"}
        </h1>
        <Button variant="outline" onClick={() => navigate("/clientes")}>
          Voltar
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando dados do cliente...</p>
          </div>
        ) : (
          <ClienteForm 
            cliente={cliente} 
            onSubmit={handleSubmit} 
            isSubmitting={criarClienteMutation.isPending || atualizarClienteMutation.isPending} 
          />
        )}
      </div>
    </div>
  );
};

export default ClienteFormPage;

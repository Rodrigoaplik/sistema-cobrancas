
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cliente } from "@/types";
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

const ClientesListPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simula o carregamento de dados
  // Em um caso real, substituiria isso por chamadas a uma API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simula um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados de exemplo
        const mockClientes = localStorage.getItem('clientes');
        if (mockClientes) {
          setClientes(JSON.parse(mockClientes));
        } else {
          setClientes([]);
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleDeleteCliente = async (id: string) => {
    try {
      // Em um cenário real, faria uma chamada para deletar na API
      const updatedClientes = clientes.filter(cliente => cliente.id !== id);
      setClientes(updatedClientes);
      localStorage.setItem('clientes', JSON.stringify(updatedClientes));
      
      toast({
        title: "Cliente excluído com sucesso",
        description: "O cliente foi removido da lista.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: "Ocorreu um erro ao tentar excluir o cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes Cadastrados</h1>
        <Button asChild>
          <Link to="/clientes/novo">Adicionar Cliente</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando clientes...</p>
        </div>
      ) : clientes.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-lg text-gray-500">Nenhum cliente cadastrado</p>
          <Button asChild className="mt-4">
            <Link to="/clientes/novo">Cadastrar Novo Cliente</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{`${cliente.cidade}/${cliente.estado}`}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link to={`/clientes/${cliente.id}/cobrancas`}>
                          Cobranças
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link to={`/clientes/editar/${cliente.id}`}>
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cliente.id && handleDeleteCliente(cliente.id)}
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

export default ClientesListPage;

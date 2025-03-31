
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { Cliente, Cobranca } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CobrancasListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // Simula um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Busca o cliente
        const clientesStorage = localStorage.getItem('clientes');
        if (clientesStorage) {
          const clientes: Cliente[] = JSON.parse(clientesStorage);
          const clienteEncontrado = clientes.find(c => c.id === id);
          
          if (clienteEncontrado) {
            setCliente(clienteEncontrado);
          } else {
            toast({
              title: "Cliente não encontrado",
              description: "O cliente solicitado não foi encontrado.",
              variant: "destructive",
            });
            navigate("/clientes");
            return;
          }
        } else {
          toast({
            title: "Nenhum cliente cadastrado",
            description: "Não há clientes cadastrados no sistema.",
            variant: "destructive",
          });
          navigate("/clientes");
          return;
        }
        
        // Busca as cobranças
        const cobrancasStorage = localStorage.getItem('cobrancas');
        if (cobrancasStorage) {
          const todasCobrancas: Cobranca[] = JSON.parse(cobrancasStorage);
          // Filtra apenas as cobranças do cliente atual
          const cobrancasDoCliente = todasCobrancas.filter(c => c.clienteId === id);
          
          // Converte string em objeto Date para as datas
          const cobrancasComDatas = cobrancasDoCliente.map(c => ({
            ...c,
            dataVencimento: new Date(c.dataVencimento),
            dataPagamento: c.dataPagamento ? new Date(c.dataPagamento) : undefined
          }));
          
          setCobrancas(cobrancasComDatas);
        } else {
          setCobrancas([]);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar as cobranças do cliente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  const handleDeleteCobranca = async (cobrancaId: string) => {
    try {
      // Em um cenário real, faria uma chamada para deletar na API
      const cobrancasStorage = localStorage.getItem('cobrancas');
      if (cobrancasStorage) {
        const todasCobrancas: Cobranca[] = JSON.parse(cobrancasStorage);
        const cobrancasAtualizadas = todasCobrancas.filter(c => c.id !== cobrancaId);
        
        localStorage.setItem('cobrancas', JSON.stringify(cobrancasAtualizadas));
        
        // Atualiza a lista local
        setCobrancas(cobrancas.filter(c => c.id !== cobrancaId));
        
        toast({
          title: "Cobrança excluída com sucesso",
          description: "A cobrança foi removida com sucesso.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao excluir cobrança",
        description: "Ocorreu um erro ao tentar excluir a cobrança.",
        variant: "destructive",
      });
    }
  };

  // Função para determinar a classe de cor com base no status
  const getStatusColor = (status: string, dataVencimento: Date) => {
    const hoje = new Date();
    
    if (status === "pago") return "text-green-600";
    if (status === "atrasado") return "text-red-600";
    if (dataVencimento < hoje && status === "pendente") return "text-orange-600";
    return "text-blue-600";
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cobranças</h1>
          {cliente && (
            <p className="text-gray-500">
              Cliente: {cliente.nome} ({cliente.email})
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/clientes")}>
            Voltar para Clientes
          </Button>
          {id && (
            <Button asChild>
              <Link to={`/clientes/${id}/cobrancas/nova`}>
                Nova Cobrança
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando cobranças...</p>
        </div>
      ) : cobrancas.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-lg text-gray-500">Nenhuma cobrança cadastrada</p>
          {id && (
            <Button asChild className="mt-4">
              <Link to={`/clientes/${id}/cobrancas/nova`}>
                Adicionar Nova Cobrança
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
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Status</TableHead>
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
                    {format(new Date(cobranca.dataVencimento), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStatusColor(cobranca.status, new Date(cobranca.dataVencimento))}`}>
                      {cobranca.status === "pendente" ? "Pendente" : 
                       cobranca.status === "pago" ? "Pago" : "Atrasado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link to={`/clientes/${id}/cobrancas/editar/${cobranca.id}`}>
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

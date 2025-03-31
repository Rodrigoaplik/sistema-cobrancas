
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CobrancaForm from "@/components/CobrancaForm";
import { Cliente, Cobranca, StorageCobranca } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const CobrancaFormPage = () => {
  const { clienteId, cobrancaId } = useParams<{ clienteId: string; cobrancaId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cobranca, setCobranca] = useState<Cobranca | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(cobrancaId ? true : false);

  useEffect(() => {
    if (!clienteId) {
      navigate("/clientes");
      return;
    }

    const fetchData = async () => {
      try {
        // Busca dados do cliente
        const clientesStorage = localStorage.getItem('clientes');
        if (clientesStorage) {
          const clientes: Cliente[] = JSON.parse(clientesStorage);
          const clienteEncontrado = clientes.find(c => c.id === clienteId);
          
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

        // Se estiver editando, busca dados da cobrança
        if (cobrancaId) {
          setIsLoading(true);
          // Simula um atraso de rede
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const cobrancasStorage = localStorage.getItem('cobrancas');
          if (cobrancasStorage) {
            const storageCobrancas: StorageCobranca[] = JSON.parse(cobrancasStorage);
            const storageCobranca = storageCobrancas.find(c => c.id === cobrancaId);
            
            if (storageCobranca) {
              // Converte de StorageCobranca para Cobranca (string para Date)
              setCobranca({
                ...storageCobranca,
                dataVencimento: new Date(storageCobranca.dataVencimento),
                dataPagamento: storageCobranca.dataPagamento 
                  ? new Date(storageCobranca.dataPagamento)
                  : undefined
              });
            } else {
              toast({
                title: "Cobrança não encontrada",
                description: "A cobrança solicitada não foi encontrada.",
                variant: "destructive",
              });
              navigate(`/clientes/${clienteId}/cobrancas`);
              return;
            }
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar os dados.",
          variant: "destructive",
        });
        if (cobrancaId) setIsLoading(false);
      }
    };

    fetchData();
  }, [clienteId, cobrancaId, navigate, toast]);

  const handleSubmit = async (data: Cobranca) => {
    if (!clienteId) return;
    
    try {
      // Em um cenário real, enviaríamos os dados para a API
      const cobrancasStorage = localStorage.getItem('cobrancas');
      let storageCobrancas: StorageCobranca[] = cobrancasStorage ? JSON.parse(cobrancasStorage) : [];
      
      // Converte de Cobranca para StorageCobranca (Date para string)
      const storageCobranca: StorageCobranca = {
        ...data,
        dataVencimento: data.dataVencimento.toISOString(),
        dataPagamento: data.dataPagamento ? data.dataPagamento.toISOString() : undefined
      };
      
      if (cobrancaId) {
        // Atualização de cobrança existente
        storageCobrancas = storageCobrancas.map(c => 
          c.id === cobrancaId ? { ...storageCobranca, id: cobrancaId } : c
        );
      } else {
        // Nova cobrança
        storageCobrancas.push({ ...storageCobranca, id: uuidv4() });
      }
      
      localStorage.setItem('cobrancas', JSON.stringify(storageCobrancas));
      
      toast({
        title: "Cobrança salva com sucesso!",
        description: "Os dados da cobrança foram salvos.",
      });
      
      navigate(`/clientes/${clienteId}/cobrancas`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar cobrança",
        description: "Ocorreu um erro ao salvar os dados da cobrança.",
        variant: "destructive",
      });
    }
  };

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
          />
        ) : (
          <p className="text-center text-red-500">Cliente não identificado</p>
        )}
      </div>
    </div>
  );
};

export default CobrancaFormPage;

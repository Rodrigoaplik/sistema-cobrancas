
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ClienteForm from "@/components/ClienteForm";
import { Cliente } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ClienteFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      // Em um cenário real, buscaríamos os dados do cliente da API
      const fetchCliente = async () => {
        try {
          setIsLoading(true);
          // Simula um atraso de rede
          await new Promise(resolve => setTimeout(resolve, 800));
          
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
            }
          }
        } catch (error) {
          toast({
            title: "Erro ao carregar cliente",
            description: "Não foi possível carregar os dados do cliente.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchCliente();
    }
  }, [id, navigate, toast]);

  const handleSubmit = async (data: Cliente) => {
    try {
      // Em um cenário real, enviaríamos os dados para a API
      const clientesStorage = localStorage.getItem('clientes');
      let clientes: Cliente[] = clientesStorage ? JSON.parse(clientesStorage) : [];
      
      if (id) {
        // Atualização de cliente existente
        clientes = clientes.map(c => (c.id === id ? { ...data, id } : c));
      } else {
        // Novo cliente
        clientes.push({ ...data, id: uuidv4() });
      }
      
      localStorage.setItem('clientes', JSON.stringify(clientes));
      
      toast({
        title: "Cliente salvo com sucesso!",
        description: "Os dados do cliente foram salvos.",
      });
      
      navigate("/clientes");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar cliente",
        description: "Ocorreu um erro ao salvar os dados do cliente.",
        variant: "destructive",
      });
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
          <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default ClienteFormPage;

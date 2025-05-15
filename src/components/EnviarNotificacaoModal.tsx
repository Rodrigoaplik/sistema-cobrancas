
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import notificacaoService from "@/services/notificacaoService";
import clienteService from "@/services/clienteService";
import cobrancaService from "@/services/cobrancaService";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EnviarNotificacaoModalProps {
  clienteId: string;
  cobrancaId?: string;
  clienteNome?: string;
  valorCobranca?: number;
  descricaoCobranca?: string;
  dataVencimento?: Date | string;
  disabled?: boolean;
  onSuccess?: () => void;
}

const EnviarNotificacaoModal = ({
  clienteId,
  cobrancaId,
  clienteNome: propClienteNome,
  valorCobranca: propValorCobranca,
  descricaoCobranca: propDescricaoCobranca,
  dataVencimento: propDataVencimento,
  disabled = false,
  onSuccess,
}: EnviarNotificacaoModalProps) => {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<'whatsapp' | 'email'>('whatsapp');
  const [mensagem, setMensagem] = useState('');
  const [assunto, setAssunto] = useState('');
  const { toast } = useToast();
  
  // Buscar cliente com React Query
  const { data: cliente } = useQuery({
    queryKey: ["cliente", clienteId],
    queryFn: () => clienteId ? clienteService.buscarCliente(clienteId) : null,
    enabled: !!clienteId && !propClienteNome,
  });

  // Buscar cobrança com React Query
  const { data: cobranca } = useQuery({
    queryKey: ["cobranca", cobrancaId],
    queryFn: () => cobrancaId ? cobrancaService.buscarCobranca(cobrancaId) : null,
    enabled: !!cobrancaId && (!propValorCobranca || !propDescricaoCobranca || !propDataVencimento),
  });

  // Preparar dados para exibição
  const clienteNome = propClienteNome || cliente?.nome || 'Cliente';
  const valorCobranca = propValorCobranca || cobranca?.valor || 0;
  const descricaoCobranca = propDescricaoCobranca || cobranca?.descricao || 'Cobrança';
  const dataVencimento = propDataVencimento || cobranca?.dataVencimento || new Date();
  
  const valorFormatado = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valorCobranca);

  const dataFormatada = dataVencimento instanceof Date 
    ? format(dataVencimento, 'dd/MM/yyyy')
    : format(new Date(dataVencimento), 'dd/MM/yyyy');

  // Modelos de mensagens
  const modeloWhatsApp = `Olá ${clienteNome},\n\nGostaríamos de lembrá-lo sobre a cobrança referente a "${descricaoCobranca}" no valor de ${valorFormatado} com vencimento em ${dataFormatada}.\n\nPara sua comodidade, disponibilizamos um link de pagamento. Obrigado!`;
  
  const modeloEmail = `Prezado(a) ${clienteNome},\n\nEste é um lembrete amigável sobre a cobrança referente a "${descricaoCobranca}" no valor de ${valorFormatado} com data de vencimento em ${dataFormatada}.\n\nPara sua conveniência, disponibilizamos um link para pagamento online.\n\nCaso já tenha efetuado o pagamento, por favor desconsidere esta mensagem.\n\nAtenciosamente,\nEquipe de Cobranças`;

  // Inicializar mensagens quando o modal abrir
  useEffect(() => {
    if (open) {
      setMensagem(tipo === 'whatsapp' ? modeloWhatsApp : modeloEmail);
      setAssunto(`Lembrete: Cobrança ${descricaoCobranca}`);
    }
  }, [open, tipo]);

  // Modificar mensagem quando alterar o tipo (WhatsApp/Email)
  useEffect(() => {
    setMensagem(tipo === 'whatsapp' ? modeloWhatsApp : modeloEmail);
  }, [tipo]);

  // Mutação para enviar notificação
  const enviarNotificacaoMutation = useMutation({
    mutationFn: (dados: { clienteId: string; cobrancaId?: string; tipo: string; mensagem: string; assunto?: string }) => 
      notificacaoService.enviarNotificacaoManual(dados),
    onSuccess: (data) => {
      toast({
        title: "Notificação enviada com sucesso",
        description: `A mensagem foi enviada para o cliente ${clienteNome}.`,
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar notificação",
        description: error.response?.data?.mensagem || "Não foi possível enviar a notificação.",
        variant: "destructive",
      });
    },
  });

  const handleEnviar = () => {
    const dados = {
      clienteId,
      cobrancaId,
      tipo: tipo,
      mensagem,
      assunto: tipo === 'email' ? assunto : undefined
    };

    enviarNotificacaoMutation.mutate(dados);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Enviar notificação"
          disabled={disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Notificação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Tabs defaultValue="whatsapp" value={tipo} onValueChange={(v) => setTipo(v as 'whatsapp' | 'email')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>
                <TabsContent value="whatsapp" className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Enviar mensagem para: {cliente?.whatsapp || "Número não disponível"}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mensagem-whatsapp">Mensagem</Label>
                    <Textarea
                      id="mensagem-whatsapp"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="email" className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Enviar email para: {cliente?.email || "Email não disponível"}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assunto-email">Assunto</Label>
                    <Input
                      id="assunto-email"
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mensagem-email">Mensagem</Label>
                    <Textarea
                      id="mensagem-email"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEnviar}
            disabled={enviarNotificacaoMutation.isPending || !mensagem || (tipo === 'email' && !assunto)}
          >
            {enviarNotificacaoMutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnviarNotificacaoModal;

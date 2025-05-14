
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Mail, MessageSquare } from "lucide-react";
import notificacaoService from '@/services/notificacaoService';

interface EnviarNotificacaoModalProps {
  clienteId: string;
  cobrancaId: string;
  clienteNome?: string;
  valorCobranca?: number;
  descricaoCobranca?: string;
  dataVencimento?: Date | string;
  onSuccess?: () => void;
}

const EnviarNotificacaoModal = ({
  clienteId,
  cobrancaId,
  clienteNome = 'Cliente',
  valorCobranca = 0,
  descricaoCobranca = 'Cobrança',
  dataVencimento,
  onSuccess
}: EnviarNotificacaoModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<'aviso_vencimento' | 'cobranca_vencida'>('aviso_vencimento');
  const { toast } = useToast();

  const dataFormatada = dataVencimento 
    ? typeof dataVencimento === 'string' 
      ? new Date(dataVencimento).toLocaleDateString('pt-BR') 
      : dataVencimento.toLocaleDateString('pt-BR')
    : 'em breve';
    
  const valorFormatado = valorCobranca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  // Templates de mensagem padrão
  const [mensagemWhatsapp, setMensagemWhatsapp] = useState('');
  const [assuntoEmail, setAssuntoEmail] = useState('');
  const [mensagemEmail, setMensagemEmail] = useState('');
  
  // Atualiza templates quando o tipo muda
  useEffect(() => {
    if (tipo === 'aviso_vencimento') {
      setMensagemWhatsapp(`Olá ${clienteNome}, sua cobrança de ${descricaoCobranca} no valor de ${valorFormatado} vence em ${dataFormatada}. Acesse o link para pagamento enviado por e-mail. Obrigado!`);
      setAssuntoEmail(`Lembrete de Cobrança a Vencer - ${descricaoCobranca}`);
      setMensagemEmail(`<p>Prezado(a) ${clienteNome},</p><p>Este é um lembrete de que sua cobrança de ${descricaoCobranca} no valor de ${valorFormatado} vencerá em ${dataFormatada}.</p><p>Para sua comodidade, disponibilizamos um link para pagamento no corpo deste e-mail.</p><p>Em caso de dúvidas, estamos à disposição.</p><p>Atenciosamente,<br/>Equipe de Cobranças</p>`);
    } else {
      setMensagemWhatsapp(`ATENÇÃO ${clienteNome}, sua cobrança de ${descricaoCobranca} no valor de ${valorFormatado} está VENCIDA desde ${dataFormatada}. Por favor, regularize o pagamento o mais breve possível através do link enviado por e-mail.`);
      setAssuntoEmail(`URGENTE: Cobrança Vencida - ${descricaoCobranca}`);
      setMensagemEmail(`<p>Prezado(a) ${clienteNome},</p><p>Informamos que sua cobrança de ${descricaoCobranca} no valor de ${valorFormatado} está <strong>vencida</strong> desde ${dataFormatada}.</p><p>Para evitar juros adicionais, regularize sua situação agora mesmo através do link de pagamento disponível neste e-mail.</p><p>Em caso de dúvidas, entre em contato conosco.</p><p>Atenciosamente,<br/>Equipe de Cobranças</p>`);
    }
  }, [tipo, clienteNome, descricaoCobranca, valorFormatado, dataFormatada]);

  const handleEnviar = async () => {
    setIsLoading(true);
    try {
      const response = await notificacaoService.enviarNotificacao({
        clienteId,
        cobrancaId,
        tipo
      });

      toast({
        title: "Notificação enviada com sucesso!",
        description: "O cliente foi notificado via WhatsApp e e-mail.",
      });

      if (onSuccess) {
        onSuccess();
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast({
        title: "Erro ao enviar notificação",
        description: "Não foi possível enviar a notificação para o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Send className="mr-2 h-4 w-4" />
          Enviar Notificação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enviar Notificação para Cliente</DialogTitle>
          <DialogDescription>
            Configure a mensagem que será enviada ao cliente por WhatsApp e e-mail.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex space-x-4 items-center">
            <span className="text-sm font-medium">Tipo de notificação:</span>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={tipo === 'aviso_vencimento' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTipo('aviso_vencimento')}
              >
                Aviso de Vencimento
              </Button>
              <Button 
                variant={tipo === 'cobranca_vencida' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTipo('cobranca_vencida')}
              >
                Cobrança Vencida
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="whatsapp" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="whatsapp">
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                E-mail
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="whatsapp" className="space-y-2 mt-4">
              <div className="font-medium text-sm">Mensagem WhatsApp</div>
              <Textarea
                value={mensagemWhatsapp}
                onChange={(e) => setMensagemWhatsapp(e.target.value)}
                rows={5}
              />
            </TabsContent>
            
            <TabsContent value="email" className="space-y-2 mt-4">
              <div>
                <div className="font-medium text-sm">Assunto</div>
                <Textarea 
                  value={assuntoEmail}
                  onChange={(e) => setAssuntoEmail(e.target.value)}
                  rows={1}
                  className="mb-4"
                />
                
                <div className="font-medium text-sm">Corpo do E-mail</div>
                <Textarea 
                  value={mensagemEmail}
                  onChange={(e) => setMensagemEmail(e.target.value)}
                  rows={8}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  *Formatação HTML suportada
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEnviar} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Notificação
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnviarNotificacaoModal;

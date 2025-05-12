
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import notificacaoService from '@/services/notificacaoService';
import { useToast } from '@/hooks/use-toast';

interface EnviarNotificacaoButtonProps {
  clienteId: string;
  cobrancaId: string;
  disabled?: boolean;
  tipo?: 'aviso_vencimento' | 'cobranca_vencida';
  onSuccess?: () => void;
}

const EnviarNotificacaoButton = ({ 
  clienteId, 
  cobrancaId, 
  disabled = false,
  tipo = 'aviso_vencimento',
  onSuccess 
}: EnviarNotificacaoButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
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
    <Button
      size="sm"
      onClick={handleClick}
      disabled={disabled || isLoading}
      variant="outline"
    >
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
  );
};

export default EnviarNotificacaoButton;

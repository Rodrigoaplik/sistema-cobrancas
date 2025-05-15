
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Cobranca } from "@/types";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const cobrancaSchema = z.object({
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
  dataVencimento: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
  status: z.enum(["pendente", "pago", "atrasado"], {
    required_error: "Status é obrigatório",
  }),
});

interface CobrancaFormProps {
  clienteId: string;
  cobranca?: Cobranca;
  onSubmit: (data: Cobranca) => void;
  isSubmitting?: boolean;
}

const CobrancaForm = ({ clienteId, cobranca, onSubmit, isSubmitting = false }: CobrancaFormProps) => {
  const { toast } = useToast();
  
  // Preparar valores padrão, garantindo que dataVencimento seja uma data
  let defaultValues = {
    clienteId,
    descricao: "",
    valor: 0,
    dataVencimento: new Date(),
    status: "pendente" as 'pendente' | 'pago' | 'atrasado',
  };

  if (cobranca) {
    defaultValues = {
      clienteId,
      descricao: cobranca.descricao || "",
      valor: cobranca.valor || 0,
      dataVencimento: cobranca.dataVencimento instanceof Date ? cobranca.dataVencimento : new Date(),
      status: cobranca.status || "pendente",
    };
  }
  
  const form = useForm<Cobranca>({
    resolver: zodResolver(cobrancaSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: Cobranca) => {
    try {
      // Garantir que clienteId seja incluído
      await onSubmit({ ...data, clienteId });
    } catch (error) {
      console.error("Erro ao salvar cobrança:", error);
      toast({
        title: "Erro ao salvar cobrança",
        description: "Ocorreu um erro ao salvar os dados da cobrança.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição da cobrança" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dataVencimento"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Vencimento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                  {...field}
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="atrasado">Atrasado</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Cobrança"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CobrancaForm;

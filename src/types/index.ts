
export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Cobranca {
  id?: string;
  clienteId: string;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  status: 'pendente' | 'pago' | 'atrasado';
  dataPagamento?: Date;
}

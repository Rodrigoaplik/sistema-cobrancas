
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

// Interface para representar cobranças como objetos Date (usados no formulário)
export interface Cobranca {
  id?: string;
  clienteId: string;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  status: 'pendente' | 'pago' | 'atrasado';
  dataPagamento?: Date;
}

// Interface para representar cobranças no localStorage (com datas como strings)
export interface StorageCobranca {
  id?: string;
  clienteId: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // ISO string
  status: 'pendente' | 'pago' | 'atrasado';
  dataPagamento?: string; // ISO string opcional
}


import React from 'react';
import { Cobranca } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CobrancaStatusBadge from './CobrancaStatusBadge';
import CobrancaDateDisplay from './CobrancaDateDisplay';
import CobrancaActionButtons from './CobrancaActionButtons';

interface CobrancaTableProps {
  cobrancas: Cobranca[];
  clienteId: string;
}

const CobrancaTable = ({ cobrancas, clienteId }: CobrancaTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
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
                <CobrancaDateDisplay date={cobranca.dataVencimento} />
              </TableCell>
              <TableCell>
                <CobrancaStatusBadge status={cobranca.status} />
              </TableCell>
              <TableCell>
                {cobranca.dataPagamento ? (
                  <CobrancaDateDisplay date={cobranca.dataPagamento} />
                ) : (
                  <span className="text-gray-500 text-sm">Não pago</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <CobrancaActionButtons cobranca={cobranca} clienteId={clienteId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CobrancaTable;

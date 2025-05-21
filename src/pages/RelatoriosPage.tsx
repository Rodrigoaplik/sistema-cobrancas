
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import cobrancaService from "@/services/cobrancaService";
import { useIsMobile } from "@/hooks/use-mobile";

// Dados simulados para os gráficos
const simulateData = (startDate: Date, endDate: Date) => {
  const data = [];
  const currentDate = new Date(startDate);
  const oneDay = 24 * 60 * 60 * 1000;
  const daysBetween = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
  
  // Limitar a 30 pontos de dados para clareza
  const step = daysBetween > 30 ? Math.floor(daysBetween / 30) : 1;
  
  while (currentDate <= endDate) {
    // Dados simulados de pagamentos e cobranças
    const paid = Math.floor(Math.random() * 5000) + 1000;
    const pending = Math.floor(Math.random() * 3000) + 500;
    const overdue = Math.floor(Math.random() * 2000) + 200;
    
    data.push({
      date: new Date(currentDate).toLocaleDateString('pt-BR'),
      pagos: paid,
      pendentes: pending,
      atrasados: overdue,
      total: paid + pending + overdue,
    });
    
    // Avançar para o próximo intervalo
    currentDate.setDate(currentDate.getDate() + step);
  }
  
  return data;
};

const RelatoriosPage = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [tipoRelatorio, setTipoRelatorio] = useState("cobranças");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  // Buscar cobranças usando React Query
  const { data: cobrancas, isLoading, error } = useQuery({
    queryKey: ["cobrancas-todas"],
    queryFn: cobrancaService.listarCobrancas,
    refetchOnWindowFocus: false,
  });
  
  const handleGerarRelatorio = () => {
    toast({
      title: "Relatório gerado com sucesso",
      description: "O relatório foi processado e está disponível para download.",
    });
  };
  
  const chartData = dateRange?.from && dateRange?.to 
    ? simulateData(dateRange.from, dateRange.to) 
    : [];
  
  const chartHeight = isMobile ? 300 : 400;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Relatórios</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Selecione os parâmetros para gerar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select 
                value={tipoRelatorio} 
                onValueChange={setTipoRelatorio}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cobranças">Cobranças</SelectItem>
                  <SelectItem value="pagamentos">Pagamentos</SelectItem>
                  <SelectItem value="clientes">Clientes Inadimplentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Período</label>
              <DateRangePicker 
                value={dateRange} 
                onChange={setDateRange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGerarRelatorio}>
            Gerar Relatório PDF
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="grafico">
        <TabsList className="mb-4">
          <TabsTrigger value="grafico">Gráfico</TabsTrigger>
          <TabsTrigger value="tabela">Tabela</TabsTrigger>
        </TabsList>
        <TabsContent value="grafico">
          <Card>
            <CardHeader>
              <CardTitle>Visualização dos Dados</CardTitle>
              <CardDescription>
                {dateRange?.from && dateRange?.to 
                  ? `Período: ${dateRange.from.toLocaleDateString('pt-BR')} até ${dateRange.to.toLocaleDateString('pt-BR')}`
                  : 'Selecione um período para visualizar os dados'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Cobranças por Status</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pagos" fill="#10b981" name="Pagos" />
                      <Bar dataKey="pendentes" fill="#f59e0b" name="Pendentes" />
                      <Bar dataKey="atrasados" fill="#ef4444" name="Atrasados" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Valor total de cobranças</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} name="Valor Total" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tabela">
          <Card>
            <CardHeader>
              <CardTitle>Dados em Tabela</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Data</th>
                      <th className="h-10 px-4 text-right font-medium">Pagos (R$)</th>
                      <th className="h-10 px-4 text-right font-medium">Pendentes (R$)</th>
                      <th className="h-10 px-4 text-right font-medium">Atrasados (R$)</th>
                      <th className="h-10 px-4 text-right font-medium">Total (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4">{row.date}</td>
                        <td className="p-4 text-right">{row.pagos.toLocaleString('pt-BR')}</td>
                        <td className="p-4 text-right">{row.pendentes.toLocaleString('pt-BR')}</td>
                        <td className="p-4 text-right">{row.atrasados.toLocaleString('pt-BR')}</td>
                        <td className="p-4 text-right font-medium">{row.total.toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;

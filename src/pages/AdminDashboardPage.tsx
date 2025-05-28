
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, DollarSign, AlertTriangle, Plus } from 'lucide-react';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { Empresa } from '@/types';

const AdminDashboardPage = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [stats, setStats] = useState({
    totalEmpresas: 0,
    empresasAtivas: 0,
    empresasVencidas: 0,
    receita: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/admin/login');
      return;
    }

    // Simulação de dados (substituir por API real)
    const mockEmpresas: Empresa[] = [
      {
        id: '1',
        nome: 'Empresa Demo 1',
        email: 'demo1@empresa.com',
        telefone: '(11) 99999-9999',
        status: 'ativa',
        plano: 'premium',
        dataVencimento: new Date('2024-12-31')
      },
      {
        id: '2',
        nome: 'Empresa Demo 2',
        email: 'demo2@empresa.com',
        telefone: '(11) 88888-8888',
        status: 'ativa',
        plano: 'basico',
        dataVencimento: new Date('2024-06-15')
      }
    ];

    setEmpresas(mockEmpresas);
    setStats({
      totalEmpresas: mockEmpresas.length,
      empresasAtivas: mockEmpresas.filter(e => e.status === 'ativa').length,
      empresasVencidas: 0,
      receita: 2500.00
    });
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge variant="default" className="bg-green-500">Ativa</Badge>;
      case 'inativa':
        return <Badge variant="secondary">Inativa</Badge>;
      case 'suspensa':
        return <Badge variant="destructive">Suspensa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanoBadge = (plano: string) => {
    switch (plano) {
      case 'basico':
        return <Badge variant="outline">Básico</Badge>;
      case 'premium':
        return <Badge variant="default" className="bg-blue-500">Premium</Badge>;
      case 'enterprise':
        return <Badge variant="default" className="bg-purple-500">Enterprise</Badge>;
      default:
        return <Badge variant="outline">{plano}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/admin/empresas/nova')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
              <Button variant="outline" onClick={() => authService.logout()}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmpresas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.empresasAtivas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencimentos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.empresasVencidas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {stats.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de empresas */}
        <Card>
          <CardHeader>
            <CardTitle>Empresas Cadastradas</CardTitle>
            <CardDescription>
              Gerencie todas as empresas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{empresa.nome}</h3>
                    <p className="text-sm text-gray-600">{empresa.email}</p>
                    <p className="text-sm text-gray-600">{empresa.telefone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(empresa.status)}
                    {getPlanoBadge(empresa.plano)}
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboardPage;

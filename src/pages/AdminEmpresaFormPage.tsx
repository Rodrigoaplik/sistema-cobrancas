
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminEmpresaFormPage = () => {
  const [empresa, setEmpresa] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    status: 'ativa',
    plano: 'basico'
  });
  
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Aqui você implementaria a chamada para a API
      // const response = await api.post('/admin/empresas', { empresa, usuario });
      
      toast({
        title: 'Empresa cadastrada com sucesso',
        description: 'A empresa e usuário foram criados.',
      });
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar empresa');
      toast({
        title: 'Erro no cadastro',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Nova Empresa</CardTitle>
                <CardDescription>
                  Cadastre uma nova empresa e seu usuário administrador
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Dados da Empresa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Dados da Empresa</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empresa-nome">Nome da Empresa *</Label>
                    <Input
                      id="empresa-nome"
                      value={empresa.nome}
                      onChange={(e) => setEmpresa({...empresa, nome: e.target.value})}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa-email">Email da Empresa *</Label>
                    <Input
                      id="empresa-email"
                      type="email"
                      value={empresa.email}
                      onChange={(e) => setEmpresa({...empresa, email: e.target.value})}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa-telefone">Telefone *</Label>
                    <Input
                      id="empresa-telefone"
                      value={empresa.telefone}
                      onChange={(e) => setEmpresa({...empresa, telefone: e.target.value})}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa-cep">CEP</Label>
                    <Input
                      id="empresa-cep"
                      value={empresa.cep}
                      onChange={(e) => setEmpresa({...empresa, cep: e.target.value})}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa-cidade">Cidade</Label>
                    <Input
                      id="empresa-cidade"
                      value={empresa.cidade}
                      onChange={(e) => setEmpresa({...empresa, cidade: e.target.value})}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa-estado">Estado</Label>
                    <Input
                      id="empresa-estado"
                      value={empresa.estado}
                      onChange={(e) => setEmpresa({...empresa, estado: e.target.value})}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa-status">Status</Label>
                    <Select value={empresa.status} onValueChange={(value) => setEmpresa({...empresa, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativa">Ativa</SelectItem>
                        <SelectItem value="inativa">Inativa</SelectItem>
                        <SelectItem value="suspensa">Suspensa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa-plano">Plano</Label>
                    <Select value={empresa.plano} onValueChange={(value) => setEmpresa({...empresa, plano: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa-endereco">Endereço Completo</Label>
                  <Input
                    id="empresa-endereco"
                    value={empresa.endereco}
                    onChange={(e) => setEmpresa({...empresa, endereco: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Dados do Usuário Administrador */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Usuário Administrador da Empresa</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario-nome">Nome do Usuário *</Label>
                    <Input
                      id="usuario-nome"
                      value={usuario.nome}
                      onChange={(e) => setUsuario({...usuario, nome: e.target.value})}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usuario-email">Email do Usuário *</Label>
                    <Input
                      id="usuario-email"
                      type="email"
                      value={usuario.email}
                      onChange={(e) => setUsuario({...usuario, email: e.target.value})}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="usuario-senha">Senha Inicial *</Label>
                    <Input
                      id="usuario-senha"
                      type="password"
                      value={usuario.senha}
                      onChange={(e) => setUsuario({...usuario, senha: e.target.value})}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <p className="text-sm text-gray-600">Mínimo 6 caracteres</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Cadastrar Empresa'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminEmpresaFormPage;

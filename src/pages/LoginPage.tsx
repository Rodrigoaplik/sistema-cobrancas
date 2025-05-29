
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, senha);
      
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao sistema!',
      });

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro no login',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-blue-600/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=2000&q=80"
          alt="Gestão e análise de dados"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-12 flex flex-col justify-center text-white">
          <div className="mb-8">
            <Building2 className="h-12 w-12 mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Sistema de Cobranças
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Gerencie suas cobranças de forma inteligente e eficiente. 
              Tenha controle total sobre seus clientes e recebimentos.
            </p>
          </div>
          <div className="space-y-4 text-sm opacity-80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Dashboard completo com métricas em tempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Gestão eficiente de clientes e cobranças</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Relatórios detalhados para tomada de decisão</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          {/* Logo para mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sistema de Cobranças
            </h1>
            <p className="text-gray-600">
              Faça login para acessar sua conta
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-gray-600">
                Entre com suas credenciais para continuar
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-gray-700 font-medium">Senha</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      disabled={loading}
                      className="h-11 pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/admin/login"
                    className="text-sm text-red-600 hover:text-red-500 hover:underline font-medium"
                  >
                    Acesso administrativo
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User } from 'lucide-react';
import { useAuth } from '@studio/hooks/use-auth';
import { Input } from '@studio/components/ui/input';
import { Button } from '@studio/components/ui/button';
import { useToast } from '@studio/hooks/use-toast';
import { Mic } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectToAfterAuth, setRedirectToAfterAuth] = useState<string | null>(null);

  const { user, register, isRegistering } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isRegistering) {
      const timer = setTimeout(() => {
        setLocation(redirectToAfterAuth || "/hub-dub/studios", { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, setLocation, isRegistering, redirectToAfterAuth]);

  const fullNameError = !formData.fullName.trim() ? "Nome completo é obrigatório" : 
    formData.fullName.trim().length < 3 ? "Mínimo de 3 caracteres" : null;

  const emailError = !formData.email.trim() ? "Email é obrigatório" : 
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? "Email inválido" : null;

  const passwordError = !formData.password ? "Senha é obrigatória" : 
    formData.password.length < 4 ? "Mínimo de 4 caracteres" : null;

  const confirmPasswordError = !formData.confirmPassword ? "Confirme sua senha" : 
    formData.password !== formData.confirmPassword ? "As senhas não coincidem" : null;

  const canSubmit = !fullNameError && !emailError && !passwordError && !confirmPasswordError && 
                   !isRegistering && !isSuccess;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    if (fullNameError || emailError || passwordError || confirmPasswordError) return;

    register(
      {
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        password: formData.password,
      },
      {
        onSuccess: (data: any) => {
          setRedirectToAfterAuth(data?.redirectTo);
          setIsSuccess(true);
          toast({ title: "Conta criada com sucesso!" });
        },
        onError: (err: any) => {
          const msg = String(err?.message || "Erro ao criar conta");
          toast({
            title: "Falha no cadastro",
            description: msg,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#090b10] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
          {/* Abstract Audio Waveform */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-end space-x-2 h-32">
              {[40, 60, 80, 120, 80, 60, 40, 90, 70, 50].map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary-500/30 rounded-full"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 text-center">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <Mic className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">HubDub</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Seu estúdio.
            <br />
            Em qualquer lugar.
          </h1>
          
          <p className="text-lg text-neutral-400 max-w-md">
            Plataforma profissional de dublagem remota para estúdios modernos
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-3/5 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo - Mobile Only */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">HubDub</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Criar sua conta
              </h2>
              <p className="text-neutral-600">
                Junte-se a estúdios profissionais
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    placeholder="Seu nome completo"
                    className={`pl-12 h-12 rounded-lg border ${
                      touched.fullName && fullNameError 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : 'border-neutral-300 focus:ring-primary-500/20 focus:border-primary-500'
                    } bg-white transition-all`}
                    autoComplete="name"
                  />
                </div>
                {touched.fullName && fullNameError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fullNameError}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="seu@email.com"
                    className={`pl-12 h-12 rounded-lg border ${
                      touched.email && emailError 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : 'border-neutral-300 focus:ring-primary-500/20 focus:border-primary-500'
                    } bg-white transition-all`}
                    autoComplete="email"
                  />
                </div>
                {touched.email && emailError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {emailError}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="••••••••"
                    className={`pl-12 pr-12 h-12 rounded-lg border ${
                      touched.password && passwordError 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : 'border-neutral-300 focus:ring-primary-500/20 focus:border-primary-500'
                    } bg-white transition-all`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {touched.password && passwordError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    placeholder="••••••••"
                    className={`pl-12 pr-12 h-12 rounded-lg border ${
                      touched.confirmPassword && confirmPasswordError 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : 'border-neutral-300 focus:ring-primary-500/20 focus:border-primary-500'
                    } bg-white transition-all`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {touched.confirmPassword && confirmPasswordError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-5" />
                    {confirmPasswordError}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isRegistering ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando conta...
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/30"></div>
                    Conta criada
                  </div>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">ou</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                Já tem conta?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Entrar
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                Ao criar uma conta você concorda com nossos{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                  Termos de Uso
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

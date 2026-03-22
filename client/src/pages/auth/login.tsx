import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@studio/hooks/use-auth';
import { Input } from '@studio/components/ui/input';
import { Button } from '@studio/components/ui/button';
import { useToast } from '@studio/hooks/use-toast';
import { Mic } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("thehub_login_email") || "";
    } catch {
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem("thehub_login_remember") === "true";
    } catch {
      return false;
    }
  });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectToAfterAuth, setRedirectToAfterAuth] = useState<string | null>(null);

  const { user, login, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("thehub_login_remember", rememberMe ? "true" : "false");
      if (rememberMe) {
        localStorage.setItem("thehub_login_email", email);
      } else {
        localStorage.removeItem("thehub_login_email");
      }
    } catch {}
  }, [rememberMe, email]);

  useEffect(() => {
    if (user && !isLoggingIn) {
      const timer = setTimeout(() => {
        setLocation(redirectToAfterAuth || "/hub-dub/studios", { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, setLocation, isLoggingIn, redirectToAfterAuth]);

  const emailError = !email.trim() ? "Email é obrigatório" : 
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "Email inválido" : null;

  const passwordError = !password ? "Senha é obrigatória" : 
    password.length < 4 ? "Mínimo de 4 caracteres" : null;

  const canSubmit = !emailError && !passwordError && !isLoggingIn && !isSuccess;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;

    login(
      { email: email.trim(), password },
      {
        onSuccess: (data: any) => {
          setRedirectToAfterAuth(data?.redirectTo);
          setIsSuccess(true);
          toast({ title: "Bem-vindo de volta!" });
        },
        onError: (err: any) => {
          toast({
            title: "Falha no login",
            description: String(err?.message || "Credenciais inválidas."),
            variant: "destructive",
          });
        },
      }
    );
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
                Entrar na sua conta
              </h2>
              <p className="text-neutral-600">
                Bem-vindo de volta
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">
                    Senha
                  </label>
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    placeholder="••••••••"
                    className={`pl-12 pr-12 h-12 rounded-lg border ${
                      touched.password && passwordError 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : 'border-neutral-300 focus:ring-primary-500/20 focus:border-primary-500'
                    } bg-white transition-all`}
                    autoComplete="current-password"
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

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500/20"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-neutral-600">
                  Lembrar de mim
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/30"></div>
                    Autorizado
                  </div>
                ) : (
                  "Entrar"
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

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                Não tem conta?{' '}
                <Link 
                  href="/auth/signup" 
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

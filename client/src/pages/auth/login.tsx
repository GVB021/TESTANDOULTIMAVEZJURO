import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Mic } from 'lucide-react';
import { useAuth } from '@studio/hooks/use-auth';
import { useToast } from '@studio/hooks/use-toast';

// Audio Waveform SVG Component
function AudioWaveform() {
  return (
    <div className="flex items-end justify-center gap-1 h-24">
      {[30, 50, 80, 100, 120, 90, 60, 40, 70, 100, 130, 100, 70, 50, 80, 110, 90, 60, 40, 60].map((height, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-blue-400"
          style={{ 
            height: `${height}%`,
            opacity: 0.3 + (i % 3) * 0.2,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

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
      {/* Left Panel - 40% - Dark Brand Side */}
      <div className="hidden lg:flex lg:w-[40%] bg-gray-950 relative overflow-hidden flex-col items-center justify-center px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mic className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">HubDub</span>
          </div>

          <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
            Seu estúdio.
            <br />
            Em qualquer lugar.
          </h1>

          <div className="mb-12">
            <AudioWaveform />
          </div>

          <div className="mt-auto">
            <p className="text-sm text-gray-400 italic mb-2">
              "A dublagem remota nunca foi tão eficiente. HubDub revolucionou nosso workflow."
            </p>
            <p className="text-xs text-gray-500">— Maria Santos, Diretora de Dublagem</p>
          </div>
        </div>
      </div>

      {/* Right Panel - 60% - White Form Side */}
      <div className="w-full lg:w-[60%] bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">HubDub</span>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Bem-vindo de volta</p>
            <h2 className="text-3xl font-bold text-gray-900">Entrar na sua conta</h2>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  placeholder="seu@email.com"
                  className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-white transition-all outline-none ${
                    touched.email && emailError
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                  autoComplete="email"
                />
              </div>
              {touched.email && emailError && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />{emailError}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  placeholder="••••••••"
                  className={`w-full h-12 pl-12 pr-12 rounded-xl border bg-white transition-all outline-none ${
                    touched.password && passwordError
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && passwordError && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />{passwordError}
                </div>
              )}
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                Esqueci minha senha
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Lembrar de mim</label>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full h-12 bg-blue-600 text-white font-semibold rounded-xl transition-all ${
                !canSubmit ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />Entrando...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white" />Autorizado
                </div>
              ) : "Entrar"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <button className="w-full h-12 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

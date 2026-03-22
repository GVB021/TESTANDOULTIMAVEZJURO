import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Mic, User, Check } from 'lucide-react';
import { useAuth } from '@studio/hooks/use-auth';
import { useToast } from '@studio/hooks/use-toast';

function AudioWaveform() {
  return (
    <div className="flex items-end justify-center gap-1 h-24">
      {[30, 50, 80, 100, 120, 90, 60, 40, 70, 100, 130, 100, 70, 50, 80, 110, 90, 60, 40, 60].map((height, i) => (
        <div key={i} className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-blue-400" style={{ height: `${height}%`, opacity: 0.3 + (i % 3) * 0.2 }} />
      ))}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const colors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      {password && <p className={`text-xs ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-600' : strength === 3 ? 'text-blue-600' : strength === 4 ? 'text-green-600' : 'text-gray-400'}`}>{labels[strength]}</p>}
    </div>
  );
}

export default function Signup() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false, confirmPassword: false });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectToAfterAuth, setRedirectToAfterAuth] = useState<string | null>(null);

  const { user, register, isRegistering } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isRegistering) {
      const timer = setTimeout(() => setLocation(redirectToAfterAuth || "/hub-dub/studios", { replace: true }), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, setLocation, isRegistering, redirectToAfterAuth]);

  const fullNameError = !formData.fullName.trim() ? "Nome completo é obrigatório" : formData.fullName.trim().length < 3 ? "Mínimo de 3 caracteres" : null;
  const emailError = !formData.email.trim() ? "Email é obrigatório" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? "Email inválido" : null;
  const passwordError = !formData.password ? "Senha é obrigatória" : formData.password.length < 4 ? "Mínimo de 4 caracteres" : null;
  const confirmPasswordError = !formData.confirmPassword ? "Confirme sua senha" : formData.password !== formData.confirmPassword ? "As senhas não coincidem" : null;

  const canSubmit = !fullNameError && !emailError && !passwordError && !confirmPasswordError && agreedToTerms && !isRegistering && !isSuccess;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    if (fullNameError || emailError || passwordError || confirmPasswordError) return;
    if (!agreedToTerms) {
      toast({ title: "Termos de uso", description: "Você precisa concordar com os Termos de Uso e Política de Privacidade.", variant: "destructive" });
      return;
    }

    register(
      { email: formData.email.trim(), fullName: formData.fullName.trim(), password: formData.password },
      {
        onSuccess: (data: any) => {
          setRedirectToAfterAuth(data?.redirectTo);
          setIsSuccess(true);
          toast({ title: "Conta criada com sucesso!" });
        },
        onError: (err: any) => toast({ title: "Falha no cadastro", description: String(err?.message || "Erro ao criar conta"), variant: "destructive" }),
      }
    );
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [field]: e.target.value }));
  const handleBlur = (field: keyof typeof touched) => () => setTouched(prev => ({ ...prev, [field]: true }));

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[40%] bg-gray-950 relative overflow-hidden flex-col items-center justify-center px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"><Mic className="w-7 h-7 text-white" /></div>
            <span className="text-3xl font-bold text-white">HubDub</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">Seu estúdio.<br />Em qualquer lugar.</h1>
          <div className="mb-12"><AudioWaveform /></div>
          <div className="mt-auto">
            <p className="text-sm text-gray-400 italic mb-2">"A dublagem remota nunca foi tão eficiente. HubDub revolucionou nosso workflow."</p>
            <p className="text-xs text-gray-500">— Maria Santos, Diretora de Dublagem</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[60%] bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Mic className="w-6 h-6 text-white" /></div>
            <span className="text-2xl font-bold text-gray-900">HubDub</span>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Comece gratuitamente</p>
            <h2 className="text-3xl font-bold text-gray-900">Crie sua conta</h2>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome completo</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-5 h-5" /></div>
                <input type="text" value={formData.fullName} onChange={handleInputChange('fullName')} onBlur={handleBlur('fullName')} placeholder="Seu nome completo" 
                  className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-white transition-all outline-none ${touched.fullName && fullNameError ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`} autoComplete="name" />
              </div>
              {touched.fullName && fullNameError && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" />{fullNameError}</div>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-5 h-5" /></div>
                <input type="email" value={formData.email} onChange={handleInputChange('email')} onBlur={handleBlur('email')} placeholder="seu@email.com" 
                  className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-white transition-all outline-none ${touched.email && emailError ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`} autoComplete="email" />
              </div>
              {touched.email && emailError && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" />{emailError}</div>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-5 h-5" /></div>
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange('password')} onBlur={handleBlur('password')} placeholder="••••••••" 
                  className={`w-full h-12 pl-12 pr-12 rounded-xl border bg-white transition-all outline-none ${touched.password && passwordError ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && passwordError && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" />{passwordError}</div>}
              <PasswordStrength password={formData.password} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-5 h-5" /></div>
                <input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} onBlur={handleBlur('confirmPassword')} placeholder="••••••••" 
                  className={`w-full h-12 pl-12 pr-12 rounded-xl border bg-white transition-all outline-none ${touched.confirmPassword && confirmPasswordError ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.confirmPassword && confirmPasswordError && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" />{confirmPasswordError}</div>}
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                Concordo com os <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Termos de Uso</a> e <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Política de Privacidade</a>
              </label>
            </div>

            <button type="submit" disabled={!canSubmit} className={`w-full h-12 bg-blue-600 text-white font-semibold rounded-xl transition-all ${!canSubmit ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25'}`}>
              {isRegistering ? <div className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Criando conta...</div> : isSuccess ? <div className="flex items-center justify-center gap-2"><Check className="w-5 h-5" />Conta criada</div> : "Criar conta grátis"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Já tem conta?{' '}<Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">Entrar</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

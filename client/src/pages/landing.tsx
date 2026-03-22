import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Mic, Menu, X, Play, Film, Cloud, Radio, BarChart3, Shield, Users, ChevronRight } from "lucide-react";

// Fade-in animation hook using Intersection Observer
function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useFadeInOnScroll();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 h-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">HubDub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection("cta")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sobre
            </button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Entrar
              </button>
            </Link>
            <Link to="/auth/signup">
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                Começar grátis
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection("cta")}
              className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2"
            >
              Sobre
            </button>
            <hr className="border-gray-200" />
            <Link to="/auth/login">
              <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Entrar
              </button>
            </Link>
            <Link to="/auth/signup">
              <button className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                Começar grátis
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle radial gradient behind mockup */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-50/80 via-white to-white pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <FadeInSection>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 bg-gray-100 rounded-full mb-8">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Plataforma profissional de dublagem
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Dublagem remota.
              <br />
              Sem fronteiras.
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Grave, sincronize e exporte dublagens de qualidade profissional de qualquer lugar do mundo. 
              Tudo na nuvem, em tempo real.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/auth/signup">
                <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25">
                  Começar grátis
                </button>
              </Link>
              <button 
                onClick={() => scrollToSection("como-funciona")}
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Ver como funciona
              </button>
            </div>
          </FadeInSection>

          {/* Mockup with 3D tilt */}
          <FadeInSection className="delay-200">
            <div className="relative max-w-5xl mx-auto perspective-1000">
              <div className="transform rotate-x-6 hover:rotate-x-0 transition-transform duration-500">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Mic className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-400 font-medium">HubDub Recording Room</p>
                      <p className="text-gray-300 text-sm">Interface profissional de dublagem</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <p className="text-sm text-gray-500 text-center mb-8">
              Usado por estúdios profissionais em todo o Brasil
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span className="text-gray-400 text-xs font-medium">LOGO {i}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-16">
              Tudo que um estúdio precisa
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Film className="w-6 h-6 text-blue-600" />,
                title: "Sincronia Absoluta",
                description: "Sincronize vídeo, áudio e roteiro com precisão de frame. Acompanhe cada tomada em tempo real.",
              },
              {
                icon: <Cloud className="w-6 h-6 text-blue-600" />,
                title: "Takes na Nuvem",
                description: "Armazene, organize e acesse todas as suas gravações de qualquer lugar. Backup automático.",
              },
              {
                icon: <Radio className="w-6 h-6 text-blue-600" />,
                title: "Room Integrada",
                description: "Sala virtual completa com comunicação em tempo real, controle de diretor e participação remota.",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
                title: "HubAlign",
                description: "Dashboard completo para gerenciar produções, sessões, dubladores e aprovações em um só lugar.",
              },
              {
                icon: <Shield className="w-6 h-6 text-blue-600" />,
                title: "Seguro e Confiável",
                description: "Criptografia de ponta a ponta, controle de acesso granular e conformidade com LGPD.",
              },
              {
                icon: <Users className="w-6 h-6 text-blue-600" />,
                title: "Multi-usuário",
                description: "Trabalhe em equipe com diretores, dubladores e técnicos simultaneamente na mesma sessão.",
              },
            ].map((feature, index) => (
              <FadeInSection key={index} className={`delay-${index * 100}`}>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section id="como-funciona" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-16">
              Simples do início ao fim
            </h2>
          </FadeInSection>

          <div className="space-y-24">
            {/* Step 01 */}
            <FadeInSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <span className="text-6xl font-bold text-blue-100">01</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Crie sua sessão</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    Configure uma nova sessão de dublagem em minutos. Importe seu vídeo, 
                    carregue o roteiro e convide sua equipe. Tudo pronto para começar.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="rounded-xl bg-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-gray-400 font-medium">Mockup: Criação de sessão</span>
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* Step 02 */}
            <FadeInSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-1">
                  <div className="rounded-xl bg-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-gray-400 font-medium">Mockup: Recording Room</span>
                  </div>
                </div>
                <div className="order-2">
                  <span className="text-6xl font-bold text-blue-100">02</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Entre na Room</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    Acesse nossa sala virtual profissional com vídeo sincronizado, 
                    roteiro interativo e controles de gravação. Diretores e dubladores 
                    trabalham juntos em tempo real.
                  </p>
                </div>
              </div>
            </FadeInSection>

            {/* Step 03 */}
            <FadeInSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <span className="text-6xl font-bold text-blue-100">03</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Grave e exporte</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    Grave suas tomadas com qualidade profissional. Revise, aprove ou 
                    solicite regravações. Exporte o áudio final mixado pronto para entrega.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="rounded-xl bg-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-gray-400 font-medium">Mockup: Exportação</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section id="cta" className="py-16 px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl p-12 sm:p-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Junte-se a centenas de estúdios que já transformaram seu workflow de dublagem.
            </p>
            <Link to="/auth/signup">
              <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Começar agora
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Tagline */}
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">HubDub</span>
              </Link>
              <p className="text-sm text-gray-500">
                A plataforma profissional de dublagem remota.
              </p>
            </div>

            {/* Produto */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection("features")} className="text-sm text-gray-500 hover:text-gray-900">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection("como-funciona")} className="text-sm text-gray-500 hover:text-gray-900">Como funciona</button></li>
                <li><span className="text-sm text-gray-500">Preços</span></li>
                <li><span className="text-sm text-gray-500">Integrações</span></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-gray-500">Sobre</span></li>
                <li><span className="text-sm text-gray-500">Blog</span></li>
                <li><span className="text-sm text-gray-500">Carreiras</span></li>
                <li><span className="text-sm text-gray-500">Contato</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-gray-500">Privacidade</span></li>
                <li><span className="text-sm text-gray-500">Termos</span></li>
                <li><span className="text-sm text-gray-500">LGPD</span></li>
                <li><span className="text-sm text-gray-500">Cookies</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-500 text-center">
              © 2024 HubDub. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

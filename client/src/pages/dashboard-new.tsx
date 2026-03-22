import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Home, 
  Film, 
  Calendar, 
  Mic, 
  Sliders, 
  Settings, 
  Bell, 
  User, 
  Plus,
  Play,
  Users,
  Search,
  ChevronDown,
  LayoutGrid,
  CalendarDays,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@studio/hooks/use-auth';
import { useProductions } from '@studio/hooks/use-productions';
import { useSessions } from '@studio/hooks/use-sessions';
import { useStudio } from '@studio/hooks/use-studios';
import { useStudioRole } from '@studio/hooks/use-studio-role';
import { isSessionVisibleOnDashboard } from '@studio/lib/session-status';

export default function Dashboard({ studioId }: { studioId: string }) {
  const { user } = useAuth();
  const studio = useStudio(studioId);
  const { data: productions } = useProductions(studioId);
  const { data: sessions } = useSessions(studioId);
  const { canCreateProductions, canCreateSessions, role } = useStudioRole(studioId);
  const isAdmin = role === 'admin' || role === 'owner';
  const isOwner = role === 'owner';
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Calculate stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const sessionsThisMonth = sessions?.filter(s => {
    const sessionDate = new Date(s.scheduledAt);
    return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
  }).length || 0;

  const totalTakes = sessions?.reduce((acc, s) => acc + ((s as any).takesCount || 0), 0) || 0;
  const activeProjects = productions?.filter(p => p.status !== 'completed').length || 0;
  const studioMembers = 25;

  const upcomingSessions = (sessions || [])
    .filter(s => isSessionVisibleOnDashboard(s.scheduledAt, s.durationMinutes ?? 60))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 4);

  const recentTakes = [
    { id: 1, character: 'João', actor: 'Carlos Silva', session: 'Sessão 1', duration: '2:34', status: 'completed' },
    { id: 2, character: 'Maria', actor: 'Ana Santos', session: 'Sessão 2', duration: '1:45', status: 'processing' },
    { id: 3, character: 'Pedro', actor: 'João Costa', session: 'Sessão 1', duration: '3:12', status: 'completed' },
    { id: 4, character: 'Lucas', actor: 'Mário Oliveira', session: 'Sessão 3', duration: '2:08', status: 'processing' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSessionStatus = (session: any) => {
    const scheduledAt = new Date(session.scheduledAt);
    const now = new Date();
    const durationMinutes = session.durationMinutes || 60;
    const endTime = new Date(scheduledAt.getTime() + durationMinutes * 60000);
    
    if (now >= scheduledAt && now <= endTime) {
      return { label: 'AO VIVO', className: 'bg-green-100 text-green-700 animate-pulse' };
    } else if (now > endTime) {
      return { label: 'CONCLUÍDA', className: 'bg-gray-100 text-gray-500' };
    } else {
      return { label: 'AGENDADA', className: 'bg-blue-100 text-blue-700' };
    }
  };

  const getTakeStatus = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'Aprovado', className: 'bg-green-100 text-green-700' };
      case 'processing': return { label: 'Pendente', className: 'bg-blue-100 text-blue-700' };
      default: return { label: 'N/A', className: 'bg-gray-100 text-gray-400' };
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Fixed 260px */}
      <aside className="hidden lg:flex lg:w-[260px] flex-col bg-white border-r border-gray-100 fixed h-full z-30">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">HubDub</span>
              <p className="text-xs text-gray-400">Studio {studio?.name || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* ESTÚDIO Section */}
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 px-3">ESTÚDIO</h3>
              <div className="space-y-1">
                <Link href={`/hub-dub/studio/${studioId}/dashboard`}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 border-l-2 border-blue-600 font-medium cursor-pointer">
                    <LayoutGrid className="w-5 h-5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link href={`/hub-dub/studio/${studioId}/productions`}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                    <Film className="w-5 h-5" />
                    <span>Projetos</span>
                  </div>
                </Link>
                <Link href={`/hub-dub/studio/${studioId}/sessions`}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                    <CalendarDays className="w-5 h-5" />
                    <span>Sessões</span>
                  </div>
                </Link>
                <Link href={`/hub-dub/studio/${studioId}/takes`}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                    <Mic className="w-5 h-5" />
                    <span>Takes</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* FERRAMENTAS Section */}
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 px-3">FERRAMENTAS</h3>
              <div className="space-y-1">
                <Link href={`/hub-dub/studio/${studioId}/hubalign`}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                    <Sliders className="w-5 h-5" />
                    <span>HubAlign</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* ADMIN Section */}
            {(isAdmin || isOwner) && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 px-3">ADMIN</h3>
                <div className="space-y-1">
                  <Link href={`/hub-dub/studio/${studioId}/admin`}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                      <Settings className="w-5 h-5" />
                      <span>Painel do Estúdio</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || 'Usuário'}</p>
              <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {user?.role || 'dubber'}
              </span>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-4 py-2">
        <div className="flex items-center justify-around">
          <Link href={`/hub-dub/studio/${studioId}/dashboard`}>
            <div className="flex flex-col items-center gap-1 p-2 text-blue-600">
              <LayoutGrid className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </div>
          </Link>
          <Link href={`/hub-dub/studio/${studioId}/productions`}>
            <div className="flex flex-col items-center gap-1 p-2 text-gray-400">
              <Film className="w-5 h-5" />
              <span className="text-xs">Projetos</span>
            </div>
          </Link>
          <Link href={`/hub-dub/studio/${studioId}/sessions`}>
            <div className="flex flex-col items-center gap-1 p-2 text-gray-400">
              <CalendarDays className="w-5 h-5" />
              <span className="text-xs">Sessões</span>
            </div>
          </Link>
          <Link href={`/hub-dub/studio/${studioId}/takes`}>
            <div className="flex flex-col items-center gap-1 p-2 text-gray-400">
              <Mic className="w-5 h-5" />
              <span className="text-xs">Takes</span>
            </div>
          </Link>
          <Link href={`/hub-dub/studio/${studioId}/hubalign`}>
            <div className="flex flex-col items-center gap-1 p-2 text-gray-400">
              <Sliders className="w-5 h-5" />
              <span className="text-xs">HubAlign</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* Top Navbar - 60px */}
        <header className="h-[60px] bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">1</span>
            </button>
            <div className="relative user-dropdown">
              <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link href={`/hub-dub/profile`}>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Perfil</div>
                  </Link>
                  <Link href={`/hub-dub/settings`}>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Configurações</div>
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">Sair</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Olá, {user?.fullName?.split(' ')[0] || 'Gabriel'} 👋</h2>
              <p className="text-gray-400">{formatDate(now).charAt(0).toUpperCase() + formatDate(now).slice(1)}</p>
            </div>
            {canCreateSessions && (
              <Link href={`/hub-dub/studio/${studioId}/sessions/new`}>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                  <Plus className="w-5 h-5" />Nova Sessão
                </button>
              </Link>
            )}
          </div>

          {/* Stats Row - 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div>
                <span className="text-xs font-medium text-green-500">+12% este mês</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">{sessionsThisMonth}</div>
              <div className="text-sm text-gray-500">Sessões este mês</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center"><Mic className="w-6 h-6 text-purple-600" /></div>
                <span className="text-xs font-medium text-green-500">+8% este mês</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">{totalTakes}</div>
              <div className="text-sm text-gray-500">Takes gravados</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center"><Film className="w-6 h-6 text-orange-600" /></div>
                <span className="text-xs font-medium text-green-500">+3% este mês</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">{activeProjects}</div>
              <div className="text-sm text-gray-500">Projetos ativos</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
                <span className="text-xs font-medium text-green-500">+5% este mês</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">{studioMembers}</div>
              <div className="text-sm text-gray-500">Membros do estúdio</div>
            </div>
          </div>

          {/* Two Column Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Próximas sessões</h3>
                <Link href={`/hub-dub/studio/${studioId}/sessions`}>
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Ver todas</span>
                </Link>
              </div>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => {
                    const status = getSessionStatus(session);
                    return (
                      <div key={session.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><Calendar className="w-5 h-5 text-blue-600" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{session.title}</p>
                          <p className="text-sm text-gray-500">{productions?.find(p => p.id === session.productionId)?.name || 'Projeto'}</p>
                        </div>
                        <div className="text-sm text-gray-500 hidden sm:block">{formatTime(session.scheduledAt)} • {new Date(session.scheduledAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</div>
                        <div className="hidden sm:flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">{String.fromCharCode(64 + i)}</div>
                          ))}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>{status.label}</span>
                        <Link href={`/hub-dub/studio/${studioId}/sessions/${session.id}/room`}>
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Entrar</button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center"><Calendar className="w-10 h-10 text-gray-300" /></div>
                  <p className="text-gray-500 mb-4">Nenhuma sessão agendada</p>
                  <Link href={`/hub-dub/studio/${studioId}/sessions/new`}>
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Criar sessão</button>
                  </Link>
                </div>
              )}
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">AÇÕES RÁPIDAS</h3>
                <div className="grid grid-cols-2 gap-3">
                  {canCreateProductions && (
                    <Link href={`/hub-dub/studio/${studioId}/productions/new`}>
                      <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <Film className="w-5 h-5 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700 text-center">Criar Projeto</span>
                      </button>
                    </Link>
                  )}
                  {canCreateSessions && (
                    <Link href={`/hub-dub/studio/${studioId}/sessions/new`}>
                      <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700 text-center">Agendar Sessão</span>
                      </button>
                    </Link>
                  )}
                  <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <UserPlus className="w-5 h-5 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700 text-center">Convidar Membro</span>
                  </button>
                  <Link href={`/hub-dub/studio/${studioId}/hubalign`}>
                    <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <Sliders className="w-5 h-5 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700 text-center">Abrir HubAlign</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Takes Recentes */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Takes recentes</h3>
                <Link href={`/hub-dub/studio/${studioId}/takes`}>
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Ver todos</span>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <th className="pb-4">Personagem</th>
                      <th className="pb-4">Ator</th>
                      <th className="pb-4">Sessão</th>
                      <th className="pb-4">Duração</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentTakes.map((take) => {
                      const status = getTakeStatus(take.status);
                      return (
                        <tr key={take.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4"><span className="font-medium text-gray-900">{take.character}</span></td>
                          <td className="py-4 text-gray-600">{take.actor}</td>
                          <td className="py-4 text-gray-600">{take.session}</td>
                          <td className="py-4 text-gray-600">{take.duration}</td>
                          <td className="py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>{status.label}</span></td>
                          <td className="py-4">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Play className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

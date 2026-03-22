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
  LogOut, 
  Plus,
  Play,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '@studio/hooks/use-auth';
import { Button } from '@studio/components/ui/button';
import { useProductions } from '@studio/hooks/use-productions';
import { useSessions } from '@studio/hooks/use-sessions';
import { useStudio } from '@studio/hooks/use-studios';
import { useStudioRole } from '@studio/hooks/use-studio-role';
import { pt } from '@studio/lib/i18n';
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
  const studioMembers = 5; // This would come from studio members API

  const upcomingSessions = (sessions || [])
    .filter(s => isSessionVisibleOnDashboard(s.scheduledAt, s.durationMinutes ?? 60))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const recentTakes = [
    { id: 1, character: 'João', actor: 'Carlos Silva', session: 'Sessão 1', duration: '2:34', status: 'completed' },
    { id: 2, character: 'Maria', actor: 'Ana Santos', session: 'Sessão 2', duration: '1:45', status: 'processing' },
    { id: 3, character: 'Pedro', actor: 'João Costa', session: 'Sessão 1', duration: '3:12', status: 'completed' },
    { id: 4, character: 'Lucas', actor: 'Mário Oliveira', session: 'Sessão 3', duration: '2:08', status: 'processing' },
    { id: 5, character: 'Sofia', actor: 'Laura Mendes', session: 'Sessão 2', duration: '1:56', status: 'completed' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processing': return 'Processando';
      case 'scheduled': return 'Agendado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r border-neutral-200 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">HubDub</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-6">
            {/* Estúdio Section */}
            <div>
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">ESTÚDIO</h3>
              <div className="space-y-1">
                <Link href={`/hub-dub/studio/${studioId}/dashboard`}>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors bg-primary-50 text-primary-700 border-l-4 border-primary-500">
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </div>
                </Link>
                <Link href={`/hub-dub/studio/${studioId}/productions`}>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors">
                    <Film className="w-5 h-5" />
                    <span>Projetos</span>
                  </div>
                </Link>
                <Link href={`/hub-dub/studio/${studioId}/sessions`}>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span>Sessões</span>
                  </div>
                </Link>
                <Link href={`/hub-dub/studio/${studioId}/takes`}>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors">
                    <Mic className="w-5 h-5" />
                    <span>Takes</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Ferramentas Section */}
            <div>
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">FERRAMENTAS</h3>
              <div className="space-y-1">
                <Link href={`/hub-dub/studio/${studioId}/hubalign`}>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors">
                    <Sliders className="w-5 h-5" />
                    <span>HubAlign</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Admin Section */}
            {(isAdmin || isOwner) && (
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">ADMIN</h3>
                <div className="space-y-1">
                  <Link href={`/hub-dub/studio/${studioId}/admin`}>
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors">
                      <Settings className="w-5 h-5" />
                      <span>Painel do Estúdio</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user?.fullName || 'Usuário'}
              </p>
              <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                {user?.role || 'dubber'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navbar */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
              <p className="text-sm text-neutral-500">{formatDate(now)}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Sessão
              </Button>
              
              {/* Notifications */}
              <button className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-300 transition-colors"
                >
                  <User className="w-5 h-5 text-neutral-600" />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                    <Link href={`/hub-dub/profile`}>
                      <div className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors">
                        Perfil
                      </div>
                    </Link>
                    <Link href={`/hub-dub/settings`}>
                      <div className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors">
                        Configurações
                      </div>
                    </Link>
                    <div className="border-t border-neutral-200 my-1"></div>
                    <button className="w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors text-left">
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Olá, {user?.fullName?.split(' ')[0] || 'Bem-vindo'} 👋
            </h2>
            <p className="text-neutral-600">{formatDate(now)}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-primary-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{sessionsThisMonth}</div>
              <div className="text-sm text-neutral-500">Sessões este mês</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <Mic className="w-8 h-8 text-primary-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{totalTakes}</div>
              <div className="text-sm text-neutral-500">Takes gravados</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <Film className="w-8 h-8 text-primary-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{activeProjects}</div>
              <div className="text-sm text-neutral-500">Projetos ativos</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-primary-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{studioMembers}</div>
              <div className="text-sm text-neutral-500">Membros do estúdio</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">Próximas Sessões</h3>
                  <Link href={`/hub-dub/studio/${studioId}/sessions`}>
                    <span className="text-sm text-primary-600 hover:text-primary-700 transition-colors">Ver todas</span>
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900 mb-1">{session.title}</div>
                          <div className="text-sm text-neutral-500 mb-2">
                            {formatTime(session.scheduledAt)} • {new Date(session.scheduledAt).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(session.status)}`}>
                              {getStatusText(session.status)}
                            </span>
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 bg-neutral-200 rounded-full border-2 border-white"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="ml-4">
                          Entrar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 mb-4">Nenhuma sessão agendada</p>
                    <Button variant="outline">Criar sessão</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Takes */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">Takes Recentes</h3>
                  <Link href={`/hub-dub/studio/${studioId}/takes`}>
                    <span className="text-sm text-primary-600 hover:text-primary-700 transition-colors">Ver todos</span>
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {recentTakes.map((take) => (
                    <div key={take.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900">{take.character}</div>
                          <div className="text-sm text-neutral-500">{take.actor} • {take.session}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-neutral-500">{take.duration}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(take.status)}`}>
                          {getStatusText(take.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                <Film className="w-5 h-5" />
                <span>Criar Projeto</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                <Calendar className="w-5 h-5" />
                <span>Agendar Sessão</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                <Users className="w-5 h-5" />
                <span>Convidar Membro</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                <Sliders className="w-5 h-5" />
                <span>Abrir HubAlign</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

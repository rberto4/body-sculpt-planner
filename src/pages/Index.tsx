
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useRoutines } from "@/hooks/useSupabaseQuery";
import { useCoachClients } from "@/hooks/useCoachClient";
import { Calendar, TrendingUp, Users, Edit, MessageCircle, Play, Dumbbell } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isCoach = profile?.role === 'coach';
  
  const { data: routines = [] } = useRoutines();
  const { data: clients = [] } = useCoachClients();

  if (!profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Ciao, {profile.full_name || 'Utente'}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isCoach 
              ? `Gestisci i tuoi ${clients.length} clienti e le loro routine di allenamento`
              : 'Pronto per il prossimo allenamento?'
            }
          </p>
        </div>

        {isCoach ? (
          // Dashboard Coach
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Statistiche Coach */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clienti Attivi</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-xs text-muted-foreground">
                  {clients.length === 0 ? 'Inizia invitando il primo cliente' : 'Clienti sotto la tua guida'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Routine Create</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{routines.length}</div>
                <p className="text-xs text-muted-foreground">
                  Programmi di allenamento personalizzati
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messaggi</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">•</div>
                <p className="text-xs text-muted-foreground">
                  Resta in contatto con i tuoi clienti
                </p>
              </CardContent>
            </Card>

            {/* Azioni rapide Coach */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Azioni Rapide</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate('/clients')}
                  className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gestisci Clienti
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/routines')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Routine
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/exercises')}
                >
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Libreria Esercizi
                </Button>
              </CardContent>
            </Card>

            {/* Clienti recenti */}
            {clients.length > 0 && (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Clienti Recenti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clients.slice(0, 3).map((client: any) => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <span>{client.client.full_name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/routines?client=${client.client.id}`)}
                          >
                            Routine
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/chat/${client.client.id}`)}
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Dashboard Cliente
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Le mie routine */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/routines')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Le mie Routine</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{routines.length}</div>
                <p className="text-xs text-muted-foreground">
                  Programmi assegnati dal tuo coach
                </p>
              </CardContent>
            </Card>

            {/* Calendario */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/calendar')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calendario</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">•</div>
                <p className="text-xs text-muted-foreground">
                  Pianifica i tuoi allenamenti
                </p>
              </CardContent>
            </Card>

            {/* Progressi */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/progress')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progressi</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">📈</div>
                <p className="text-xs text-muted-foreground">
                  Monitora i tuoi miglioramenti
                </p>
              </CardContent>
            </Card>

            {/* Routine di oggi */}
            {routines.filter((r: any) => {
              const today = new Date().toLocaleDateString('it-IT', { weekday: 'long' });
              const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);
              return r.assigned_days?.includes(todayCapitalized);
            }).length > 0 && (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Allenamenti di Oggi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routines
                      .filter((r: any) => {
                        const today = new Date().toLocaleDateString('it-IT', { weekday: 'long' });
                        const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);
                        return r.assigned_days?.includes(todayCapitalized);
                      })
                      .map((routine: any) => (
                        <div key={routine.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{routine.name}</h3>
                            <p className="text-sm text-gray-500">{routine.type}</p>
                          </div>
                          <Button 
                            onClick={() => {
                              localStorage.setItem('activeWorkout', JSON.stringify(routine));
                              navigate("/training", { state: { routine } });
                            }}
                            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Inizia
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

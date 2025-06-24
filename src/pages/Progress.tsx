
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award, Trophy, Flame } from "lucide-react";
import { useWorkouts, useRoutines } from "@/hooks/useSupabaseQuery";

const Progress = () => {
  const { data: workouts = [] } = useWorkouts();
  const { data: routines = [] } = useRoutines();

  const completedWorkouts = workouts.filter(w => w.is_completed);
  const totalWorkouts = completedWorkouts.length;
  const totalRoutines = routines.length;
  const activeRoutines = routines.filter(r => r.is_assigned).length;

  // Calculate streak (simplified - consecutive days with workouts)
  const today = new Date();
  const sortedWorkouts = completedWorkouts.sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  let currentStreak = 0;
  if (sortedWorkouts.length > 0) {
    const lastWorkout = new Date(sortedWorkouts[0].completed_at);
    const daysDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) { // Worked out today or yesterday
      currentStreak = 1;
      // Count consecutive days (simplified)
      for (let i = 1; i < sortedWorkouts.length; i++) {
        const current = new Date(sortedWorkouts[i-1].completed_at);
        const previous = new Date(sortedWorkouts[i].completed_at);
        const diff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff <= 2) { // Allow for one day gap
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Group workouts by exercise for progress tracking
  const exerciseProgress: { [key: string]: any[] } = {};
  
  completedWorkouts.forEach(workout => {
    workout.workout_exercises?.forEach((we: any) => {
      const exerciseName = we.exercise?.name || 'Unknown';
      if (!exerciseProgress[exerciseName]) {
        exerciseProgress[exerciseName] = [];
      }
      exerciseProgress[exerciseName].push({
        date: workout.completed_at,
        sets: we.sets_completed,
        reps: we.reps_completed,
        completed: we.is_completed
      });
    });
  });

  const getProgressIndicator = (sessions: any[]) => {
    if (sessions.length < 2) return { trend: "neutral", percentage: 0 };
    
    const validSessions = sessions.filter(s => s.reps && s.reps.length > 0);
    if (validSessions.length < 2) return { trend: "neutral", percentage: 0 };
    
    const first = validSessions[validSessions.length - 1].reps[0] || 0;
    const latest = validSessions[0].reps[0] || 0;
    
    if (first === 0) return { trend: "neutral", percentage: 0 };
    
    const percentage = Math.round(((latest - first) / first) * 100);
    
    return {
      trend: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
      percentage: Math.abs(percentage)
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 font-outfit">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Tracciamento Progressi
          </h1>
          <p className="text-slate-300">Monitora il tuo percorso fitness e i record personali</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalWorkouts}</div>
              <div className="text-slate-400 text-sm">Workout Totali</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{activeRoutines}</div>
              <div className="text-slate-400 text-sm">Routine Attive</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalRoutines}</div>
              <div className="text-slate-400 text-sm">Routine Create</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-3">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{currentStreak}</div>
              <div className="text-slate-400 text-sm">Streak Giorni</div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Progress */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Progresso Esercizi</h2>
          
          {Object.entries(exerciseProgress).slice(0, 6).map(([exerciseName, sessions], index) => {
            const progress = getProgressIndicator(sessions);
            const recentSessions = sessions.slice(0, 4);
            
            return (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white font-outfit">{exerciseName}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={progress.trend === "up" ? "default" : "outline"}
                        className={
                          progress.trend === "up" 
                            ? "bg-emerald-500 text-black" 
                            : progress.trend === "down"
                            ? "border-red-500 text-red-400"
                            : "border-slate-500 text-slate-400"
                        }
                      >
                        {progress.trend === "up" && "↗"} 
                        {progress.trend === "down" && "↘"}
                        {progress.percentage > 0 && `${progress.percentage}%`}
                        {progress.percentage === 0 && "Nessun cambiamento"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Timeline */}
                    <div className="relative">
                      <div className="flex justify-between items-end h-32 bg-white/10 rounded-lg p-4">
                        {recentSessions.map((session, sessionIndex) => {
                          const reps = session.reps?.[0] || 0;
                          const maxReps = Math.max(...recentSessions.map(s => s.reps?.[0] || 0));
                          const height = maxReps > 0 ? (reps / maxReps) * 80 : 20;
                          
                          return (
                            <div key={sessionIndex} className="flex flex-col items-center min-w-[40px]">
                              <div 
                                className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t min-w-[20px] transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
                                style={{ height: `${Math.max(height, 10)}px` }}
                              />
                              <div className="text-xs text-slate-400 mt-2">
                                {new Date(session.date).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs font-semibold text-blue-300">
                                {reps}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Sessions */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Sessioni Recenti</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {recentSessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="bg-white/10 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">
                              {new Date(session.date).toLocaleDateString('it-IT')}
                            </div>
                            <div className="text-sm font-semibold text-white">
                              {session.sets} × {session.reps?.[0] || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State for new users */}
        {totalWorkouts === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nessun dato di progresso ancora</h3>
              <p>Completa alcuni allenamenti per iniziare a tracciare i tuoi progressi</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;

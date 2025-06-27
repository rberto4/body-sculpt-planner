import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award, Trophy, Flame } from "lucide-react";
import { useWorkouts, useRoutines } from "@/hooks/useSupabaseQuery";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    
    if (daysDiff <= 1) {
      currentStreak = 1;
      for (let i = 1; i < sortedWorkouts.length; i++) {
        const current = new Date(sortedWorkouts[i-1].completed_at);
        const previous = new Date(sortedWorkouts[i].completed_at);
        const diff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff <= 2) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Raggruppa per esercizio e data
  const exerciseProgress: { [key: string]: any[] } = {};
  const exerciseSessionMap: { [key: string]: { [date: string]: any } } = {};
  console.log('DEBUG ALL completedWorkouts', completedWorkouts);
  completedWorkouts.forEach(w => {
    if (w.workout_exercises && w.workout_exercises.length > 0) {
      console.log('DEBUG workout_exercises', w.workout_exercises);
      console.log('DEBUG primo workout_exercise', w.workout_exercises[0]);
      Object.entries(w.workout_exercises[0]).forEach(([k, v]) => {
        console.log('KEY', k, v);
      });
    }
    w.workout_exercises?.forEach((we: any) => {
      const exerciseName = we.exercise?.name || 'Unknown';
      // Determina il tipo di tracking
      let trackingType = 'sets_reps';
      if (we.routine_exercise && we.routine_exercise.tracking_type) {
        trackingType = we.routine_exercise.tracking_type;
      } else if (Array.isArray(we.weight_used) && Array.isArray(we.reps_completed)) {
        trackingType = 'sets_reps';
      } else if (we.duration_completed !== null) {
        trackingType = 'duration';
      } else if (we.distance_completed !== null) {
        trackingType = 'distance_duration';
      }
      const dateKey = new Date(w.completed_at).toISOString().slice(0, 10);
      if (!exerciseProgress[exerciseName]) exerciseProgress[exerciseName] = [];
      if (!exerciseSessionMap[exerciseName]) exerciseSessionMap[exerciseName] = {};
      if (trackingType === 'sets_reps') {
        const weights = Array.isArray(we.weight_used) ? we.weight_used.map(w => Number(w) || 0) : [];
        const repsArr = Array.isArray(we.reps_completed) ? we.reps_completed.map(r => Number(r) || 0) : [];
        if (weights.length > 0 && weights.some(w => w > 0)) {
          // Per il grafico: ogni serie è un punto
          weights.forEach((wgt, idx) => {
            exerciseProgress[exerciseName].push({
              date: w.completed_at,
              value: wgt,
              metric: 'weight',
              sets: we.sets_completed,
              reps: repsArr[idx] || 0,
              completed: w.is_completed,
              workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
              routineExercise: we.routine_exercise,
              allWeights: weights
            });
          });
          // Per le sessioni recenti: raggruppa per data
          if (!exerciseSessionMap[exerciseName][dateKey]) {
            exerciseSessionMap[exerciseName][dateKey] = {
              date: w.completed_at,
              sets: we.sets_completed,
              reps: repsArr[0] || 0,
              workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
              allWeights: weights,
              metric: 'weight',
              routineExercise: we.routine_exercise
            };
          }
        } else if (we.routine_exercise?.weight && we.routine_exercise.weight > 0) {
          exerciseProgress[exerciseName].push({
            date: w.completed_at,
            value: we.routine_exercise.weight,
            metric: 'weight',
            sets: we.sets_completed,
            reps: repsArr[0] || 0,
            completed: w.is_completed,
            workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
            routineExercise: we.routine_exercise,
            allWeights: [we.routine_exercise.weight]
          });
          if (!exerciseSessionMap[exerciseName][dateKey]) {
            exerciseSessionMap[exerciseName][dateKey] = {
              date: w.completed_at,
              sets: we.sets_completed,
              reps: repsArr[0] || 0,
              workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
              allWeights: [we.routine_exercise.weight],
              metric: 'weight',
              routineExercise: we.routine_exercise
            };
          }
        }
      } else if (trackingType === 'duration') {
        const duration = we.duration_completed || 0;
        exerciseProgress[exerciseName].push({
          date: w.completed_at,
          value: duration,
          metric: 'duration',
          sets: we.sets_completed,
          reps: 0,
          completed: w.is_completed,
          workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
          routineExercise: we.routine_exercise
        });
        if (!exerciseSessionMap[exerciseName][dateKey]) {
          exerciseSessionMap[exerciseName][dateKey] = {
            date: w.completed_at,
            sets: we.sets_completed,
            reps: 0,
            workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
            allWeights: [duration],
            metric: 'duration',
            routineExercise: we.routine_exercise
          };
        }
      } else if (trackingType === 'distance_duration') {
        const distance = we.distance_completed || 0;
        exerciseProgress[exerciseName].push({
          date: w.completed_at,
          value: distance,
          metric: 'distance',
          sets: we.sets_completed,
          reps: 0,
          completed: w.is_completed,
          workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
          routineExercise: we.routine_exercise
        });
        if (!exerciseSessionMap[exerciseName][dateKey]) {
          exerciseSessionMap[exerciseName][dateKey] = {
            date: w.completed_at,
            sets: we.sets_completed,
            reps: 0,
            workoutDate: new Date(w.completed_at).toLocaleDateString('it-IT'),
            allWeights: [distance],
            metric: 'distance',
            routineExercise: we.routine_exercise
          };
        }
      }
    });
  });

  const getProgressIndicator = (sessions: any[]) => {
    if (sessions.length < 2) return { trend: "neutral", percentage: 0 };
    
    const validSessions = sessions.filter(s => s.value > 0);
    if (validSessions.length < 2) return { trend: "neutral", percentage: 0 };
    
    const sortedSessions = validSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sortedSessions[0].value;
    const latest = sortedSessions[sortedSessions.length - 1].value;
    
    if (first === 0) return { trend: "neutral", percentage: 0 };
    
    const percentage = Math.round(((latest - first) / first) * 100);
    
    return {
      trend: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
      percentage: Math.abs(percentage)
    };
  };

  const prepareChartData = (sessions: any[]) => {
    return sessions
      .filter(s => s.value > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10) // Last 10 sessions
      .map((session, index) => ({
        session: index + 1,
        value: session.value,
        date: session.workoutDate,
        fullDate: new Date(session.date).toLocaleDateString('it-IT', { 
          day: 'numeric', 
          month: 'short',
          year: 'numeric'
        })
      }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tracciamento Progressi
          </h1>
          <p className="text-gray-600">Monitora il tuo percorso fitness e i record personali</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalWorkouts}</div>
              <div className="text-gray-600 text-sm">Workout Totali</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{activeRoutines}</div>
              <div className="text-gray-600 text-sm">Routine Attive</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalRoutines}</div>
              <div className="text-gray-600 text-sm">Routine Create</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mb-3">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{currentStreak}</div>
              <div className="text-gray-600 text-sm">Streak Giorni</div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Progress */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Progresso Esercizi</h2>
          
          {Object.entries(exerciseProgress).slice(0, 8).map(([exerciseName, sessions], index) => {
            console.log('DEBUG', {exerciseName, sessions, sessionMap: exerciseSessionMap[exerciseName]});
            const progress = getProgressIndicator(sessions);
            const chartData = prepareChartData(sessions);
            const latestSession = sessions[sessions.length - 1];
            const metric = latestSession?.metric || 'reps';
            const trackingType = latestSession?.routineExercise?.tracking_type || 'sets_reps';
            
            let unit = '';
            let chartLabel = 'Valore';
            if (metric === 'weight') {
              unit = 'kg';
              chartLabel = 'Carico Massimo';
            } else if (metric === 'duration') {
              unit = 's';
              chartLabel = 'Durata';
            } else if (metric === 'distance') {
              unit = 'm';
              chartLabel = 'Distanza';
            }
            
            return (
              <Card key={index} className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 font-outfit">{exerciseName}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={progress.trend === "up" ? "default" : "outline"}
                        className={
                          progress.trend === "up" 
                            ? "bg-green-500 text-white" 
                            : progress.trend === "down"
                            ? "border-red-500 text-red-500"
                            : "border-gray-400 text-gray-500"
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
                    {/* Progress Chart */}
                    {chartData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="session" 
                              stroke="#6b7280"
                              fontSize={12}
                            />
                            <YAxis 
                              stroke="#6b7280"
                              fontSize={12}
                            />
                            <Tooltip 
                              labelFormatter={(_, payload) => {
                                if (payload && payload.length > 0) {
                                  const serie = payload[0].payload.session;
                                  const data = payload[0].payload.date;
                                  return `Serie ${serie} della sessione del ${data}`;
                                }
                                return '';
                              }}
                              formatter={(value: any) => [
                                <span style={{fontWeight: 'bold'}}>{value} {unit}</span>
                              ]}
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#111827" 
                              strokeWidth={2}
                              dot={{ fill: '#111827', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: '#111827', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">Nessun dato sufficiente per mostrare il grafico</div>
                    )}

                    {/* Recent Sessions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">Sessioni Recenti</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.values(exerciseSessionMap[exerciseName])
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .slice(-4)
                          .map((session, sessionIndex) => (
                            <div key={sessionIndex} className="bg-gray-50 rounded p-2 text-center">
                              <div className="text-xs text-gray-500">
                                {session.workoutDate}
                              </div>
                              {trackingType === 'sets_reps' && (
                                <div className="text-sm font-semibold text-gray-900">
                                  {session.sets} × {session.reps}
                                </div>
                              )}
                              {session.allWeights && session.allWeights.length > 0 && (
                                <div className="text-xs text-gray-600">
                                  {session.allWeights.filter(w => w > 0).join('/') + ' ' + unit}
                                </div>
                              )}
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
            <div className="text-gray-500 mb-4">
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

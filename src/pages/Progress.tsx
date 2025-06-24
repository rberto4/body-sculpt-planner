
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

const Progress = () => {
  // Sample progress data
  const progressData = [
    {
      exercise: "Push-ups",
      sessions: [
        { date: "2024-01-10", reps: 10, sets: 3 },
        { date: "2024-01-12", reps: 12, sets: 3 },
        { date: "2024-01-15", reps: 15, sets: 3 },
        { date: "2024-01-18", reps: 18, sets: 3 },
      ]
    },
    {
      exercise: "Pull-ups",
      sessions: [
        { date: "2024-01-10", reps: 5, sets: 3 },
        { date: "2024-01-12", reps: 6, sets: 3 },
        { date: "2024-01-15", reps: 7, sets: 3 },
        { date: "2024-01-18", reps: 8, sets: 3 },
      ]
    },
    {
      exercise: "Squats",
      sessions: [
        { date: "2024-01-11", reps: 15, sets: 3 },
        { date: "2024-01-13", reps: 18, sets: 3 },
        { date: "2024-01-16", reps: 20, sets: 3 },
        { date: "2024-01-19", reps: 22, sets: 3 },
      ]
    }
  ];

  const stats = {
    totalWorkouts: 12,
    totalExercises: 24,
    averageWorkoutTime: 45,
    personalRecords: 8
  };

  const getProgressIndicator = (sessions: any[]) => {
    if (sessions.length < 2) return { trend: "neutral", percentage: 0 };
    
    const first = sessions[0].reps;
    const latest = sessions[sessions.length - 1].reps;
    const percentage = Math.round(((latest - first) / first) * 100);
    
    return {
      trend: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
      percentage: Math.abs(percentage)
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lime-400 mb-2">Progress Tracking</h1>
          <p className="text-gray-300">Monitor your fitness journey and personal records</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-lime-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.totalWorkouts}</div>
              <div className="text-gray-400 text-sm">Total Workouts</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3 text-lime-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.totalExercises}</div>
              <div className="text-gray-400 text-sm">Exercises Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-lime-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.averageWorkoutTime}min</div>
              <div className="text-gray-400 text-sm">Avg Workout Time</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3 text-lime-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.personalRecords}</div>
              <div className="text-gray-400 text-sm">Personal Records</div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Progress */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-lime-400 mb-4">Exercise Progress</h2>
          
          {progressData.map((exercise, index) => {
            const progress = getProgressIndicator(exercise.sessions);
            
            return (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lime-400">{exercise.exercise}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={progress.trend === "up" ? "default" : "outline"}
                        className={
                          progress.trend === "up" 
                            ? "bg-green-500 text-black" 
                            : progress.trend === "down"
                            ? "border-red-500 text-red-400"
                            : "border-gray-500 text-gray-400"
                        }
                      >
                        {progress.trend === "up" && "↗"} 
                        {progress.trend === "down" && "↘"}
                        {progress.percentage > 0 && `${progress.percentage}%`}
                        {progress.percentage === 0 && "No change"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Timeline */}
                    <div className="relative">
                      <div className="flex justify-between items-end h-32 bg-gray-700/30 rounded-lg p-4">
                        {exercise.sessions.map((session, sessionIndex) => {
                          const maxReps = Math.max(...exercise.sessions.map(s => s.reps));
                          const height = (session.reps / maxReps) * 80;
                          
                          return (
                            <div key={sessionIndex} className="flex flex-col items-center">
                              <div 
                                className="bg-lime-500 rounded-t min-w-[20px] transition-all duration-300 hover:bg-lime-400"
                                style={{ height: `${height}px` }}
                              />
                              <div className="text-xs text-gray-400 mt-2">
                                {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs font-semibold text-lime-400">
                                {session.reps}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Sessions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Recent Sessions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {exercise.sessions.slice(-4).map((session, sessionIndex) => (
                          <div key={sessionIndex} className="bg-gray-700/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm font-semibold text-white">
                              {session.sets} × {session.reps}
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
        {progressData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No progress data yet</h3>
              <p>Complete some workouts to start tracking your progress</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;

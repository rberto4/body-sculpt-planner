
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExerciseBuilderDialog } from "@/components/ExerciseBuilderDialog";
import { ArrowLeft, Play, Edit, Calendar, Clock, Target, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoutine } from "@/hooks/useSupabaseQuery";

const RoutineDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: routine, isLoading, refetch } = useRoutine(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Caricamento routine...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Routine non trovata</h1>
            <Button onClick={() => navigate("/routines")} className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
              Torna alle Routine
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const calculateVolume = (exercises: any[]) => {
    if (!exercises?.length) return 0;
    const totalVolume = exercises.reduce((acc, ex) => {
      const weight = ex.weight || 0;
      const sets = ex.sets || 0;
      const reps = ex.reps || 0;
      return acc + (weight * sets * reps);
    }, 0);
    return totalVolume;
  };

  const getVolumeCategory = (volume: number) => {
    if (volume < 1000) return { label: "Low", color: "bg-green-500" };
    if (volume < 3000) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "High", color: "bg-red-500" };
  };

  const volume = calculateVolume(routine.routine_exercises);
  const volumeInfo = getVolumeCategory(volume);

  const startWorkout = () => {
    localStorage.setItem('activeWorkout', JSON.stringify(routine));
    navigate("/training", { state: { routine } });
  };

  const handleExerciseAdded = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/routines")}
            className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {routine.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Dettagli routine ed esercizi</p>
          </div>
          <div className="flex space-x-3">
            <ExerciseBuilderDialog
              routineId={routine.id}
              existingExercises={routine.routine_exercises || []}
              onExerciseAdded={handleExerciseAdded}
            />
            <Button 
              onClick={startWorkout}
              disabled={!routine.routine_exercises?.length}
              className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Inizia Allenamento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Routine Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white font-outfit">Info Routine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tipo</span>
                  <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {routine.type}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Stato</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${routine.is_assigned ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-gray-900 dark:text-white">
                      {routine.is_assigned ? 'Assegnata' : 'Non Assegnata'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Volume</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${volumeInfo.color}`} />
                    <span className="text-gray-900 dark:text-white">{volumeInfo.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({volume}kg)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Esercizi</span>
                  <span className="text-gray-900 dark:text-white">{routine.routine_exercises?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Days */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white font-outfit">Giorni Assegnati</CardTitle>
              </CardHeader>
              <CardContent>
                {routine.assigned_days?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {routine.assigned_days.map((day: string) => (
                      <Badge key={day} variant="default" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                        {day}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Nessun giorno assegnato</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Exercise List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white font-outfit">Esercizi</CardTitle>
              </CardHeader>
              <CardContent>
                {routine.routine_exercises?.length > 0 ? (
                  <div className="space-y-4">
                    {routine.routine_exercises
                      .sort((a: any, b: any) => a.order_index - b.order_index)
                      .map((routineExercise: any, index: number) => (
                      <div 
                        key={routineExercise.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{routineExercise.exercise.name}</h3>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-2">
                                <span>Esercizio {index + 1}</span>
                                {routineExercise.warmup && <Badge variant="secondary" className="text-xs">Riscaldamento</Badge>}
                                {routineExercise.mav && <Badge variant="secondary" className="text-xs">MAV</Badge>}
                              </div>
                            </div>
                            {/* Muscle group icon would go here */}
                          </div>
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            {routineExercise.tracking_type === "sets_reps" ? "Set & Rip" : 
                             routineExercise.tracking_type === "duration" ? "Durata" : "Distanza"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Set</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{routineExercise.sets}</div>
                          </div>
                          
                          {routineExercise.tracking_type === "sets_reps" ? (
                            <>
                              <div className="text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Rip</div>
                                <div className="font-semibold text-gray-900 dark:text-white">{routineExercise.reps}</div>
                              </div>
                              {routineExercise.weight && (
                                <div className="text-center">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Carico</div>
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {routineExercise.weight}{routineExercise.weight_unit}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : routineExercise.tracking_type === "duration" ? (
                            <div className="text-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Durata</div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {routineExercise.duration}{routineExercise.duration_unit === 'minutes' ? 'min' : 's'}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Distanza</div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {routineExercise.distance}{routineExercise.distance_unit}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Durata</div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {routineExercise.duration}{routineExercise.duration_unit === 'minutes' ? 'min' : 's'}
                                </div>
                              </div>
                            </>
                          )}
                          
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Riposo</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{routineExercise.rest_time}s</div>
                          </div>
                        </div>

                        {(routineExercise.rpe || routineExercise.notes) && (
                          <div className="space-y-1">
                            {routineExercise.rpe && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                🎯 RPE: {routineExercise.rpe}/10
                              </div>
                            )}
                            {routineExercise.notes && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                                📝 {routineExercise.notes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                      <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nessun esercizio in questa routine</p>
                    </div>
                    <ExerciseBuilderDialog
                      routineId={routine.id}
                      existingExercises={routine.routine_exercises || []}
                      onExerciseAdded={handleExerciseAdded}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;

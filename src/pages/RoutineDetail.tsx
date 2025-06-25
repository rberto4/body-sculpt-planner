
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoutineBuilder } from "@/components/RoutineBuilder";
import { ArrowLeft, Play, Edit, Calendar, Clock, Target, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoutine } from "@/hooks/useSupabaseQuery";

const RoutineDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: routine, isLoading, refetch } = useRoutine(id!);
  const [showBuilder, setShowBuilder] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600">Caricamento routine...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Routine non trovata</h1>
            <Button onClick={() => navigate("/routines")} className="bg-gray-900 hover:bg-gray-800 text-white">
              Torna alle Routine
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const startWorkout = () => {
    navigate("/training", { state: { routine } });
  };

  const handleExerciseAdded = () => {
    refetch();
    setShowBuilder(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/routines")}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {routine.name}
            </h1>
            <p className="text-gray-600 mt-1">Dettagli routine ed esercizi</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowBuilder(!showBuilder)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Esercizio
            </Button>
            <Button 
              onClick={startWorkout}
              disabled={!routine.routine_exercises?.length}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Inizia Allenamento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Routine Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 font-outfit">Info Routine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tipo</span>
                  <Badge variant="outline" className="border-gray-300 text-gray-700">
                    {routine.type}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stato</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${routine.is_assigned ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-gray-900">
                      {routine.is_assigned ? 'Assegnata' : 'Non Assegnata'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Volume</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getVolumeColor(routine.volume)}`} />
                    <span className="text-gray-900">{routine.volume}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Esercizi</span>
                  <span className="text-gray-900">{routine.routine_exercises?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Days */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 font-outfit">Giorni Assegnati</CardTitle>
              </CardHeader>
              <CardContent>
                {routine.assigned_days?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {routine.assigned_days.map((day: string) => (
                      <Badge key={day} variant="default" className="bg-gray-900 text-white">
                        {day}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nessun giorno assegnato</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Exercise List */}
          <div className="lg:col-span-2 space-y-6">
            {showBuilder && (
              <RoutineBuilder
                routineId={routine.id}
                existingExercises={routine.routine_exercises || []}
                onExerciseAdded={handleExerciseAdded}
              />
            )}

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 font-outfit">Esercizi</CardTitle>
              </CardHeader>
              <CardContent>
                {routine.routine_exercises?.length > 0 ? (
                  <div className="space-y-4">
                    {routine.routine_exercises
                      .sort((a: any, b: any) => a.order_index - b.order_index)
                      .map((routineExercise: any, index: number) => (
                      <div 
                        key={routineExercise.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{routineExercise.exercise.name}</h3>
                            <div className="text-sm text-gray-500 mt-1">
                              Esercizio {index + 1}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                            {routineExercise.tracking_type === "sets_reps" ? "Set & Rip" : "Durata"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Set</div>
                            <div className="font-semibold text-gray-900">{routineExercise.sets}</div>
                          </div>
                          
                          {routineExercise.tracking_type === "sets_reps" ? (
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Rip</div>
                              <div className="font-semibold text-gray-900">{routineExercise.reps}</div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Durata</div>
                              <div className="font-semibold text-gray-900">{routineExercise.duration}s</div>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Riposo</div>
                            <div className="font-semibold text-gray-900">{routineExercise.rest_time}s</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Gruppo</div>
                            <div className="font-semibold text-gray-900 text-xs">
                              {routineExercise.exercise.muscle_group}
                            </div>
                          </div>
                        </div>

                        {routineExercise.notes && (
                          <div className="text-sm text-gray-500 italic">
                            📝 {routineExercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                      <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nessun esercizio in questa routine</p>
                    </div>
                    <Button
                      onClick={() => setShowBuilder(true)}
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi il Primo Esercizio
                    </Button>
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

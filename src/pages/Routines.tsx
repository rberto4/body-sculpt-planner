import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Target, Play, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoutines, useDeleteRoutine } from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";

const Routines = () => {
  const navigate = useNavigate();
  const { data: routines = [], isLoading, refetch } = useRoutines();
  const deleteRoutineMutation = useDeleteRoutine();
  const { toast } = useToast();

  const handleDelete = async (routineId: string, routineName: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare la routine "${routineName}"?`)) {
      try {
        await deleteRoutineMutation.mutateAsync(routineId);
        toast({
          title: "Routine eliminata",
          description: `La routine "${routineName}" è stata eliminata con successo.`,
        });
        refetch();
      } catch (error) {
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'eliminazione della routine.",
          variant: "destructive",
        });
      }
    }
  };

  const startWorkout = (routine: any) => {
    localStorage.setItem('activeWorkout', JSON.stringify(routine));
    navigate("/training", { state: { routine } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Caricamento routine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Le mie Routine</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Gestisci i tuoi programmi di allenamento</p>
          </div>
          <Button 
            onClick={() => navigate("/routines/create")}
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuova Routine
          </Button>
        </div>

        {routines.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="text-center py-12">
              <Target className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nessuna routine creata</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Inizia creando la tua prima routine di allenamento</p>
              <Button 
                onClick={() => navigate("/routines/create")}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crea la tua prima routine
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <Card 
                key={routine.id} 
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => navigate(`/routines/${routine.id}`)}>
                      <CardTitle className="text-gray-900 dark:text-white font-outfit mb-2">
                        {routine.name}
                      </CardTitle>
                      <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {routine.type}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/routines/create?edit=${routine.id}`);
                        }}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(routine.id, routine.name);
                        }}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Esercizi</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {routine.routine_exercises?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Volume</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {routine.calculated_volume || 0}kg
                    </span>
                  </div>

                  {routine.assigned_days?.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Giorni assegnati:</div>
                      <div className="flex flex-wrap gap-1">
                        {routine.assigned_days.slice(0, 3).map((day: string) => (
                          <Badge key={day} variant="secondary" className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                        {routine.assigned_days.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            +{routine.assigned_days.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/routines/${routine.id}`);
                      }}
                      className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Dettagli
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        startWorkout(routine);
                      }}
                      disabled={!routine.routine_exercises?.length}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Inizia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Routines;

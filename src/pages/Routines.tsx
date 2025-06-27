import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Target, Play, Edit, Trash2, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoutines, useDeleteRoutine } from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";
import { MuscleIcon } from "@/hooks/useMuscleIcons";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";

const Routines = () => {
  const navigate = useNavigate();
  const { data: routines = [], isLoading, refetch } = useRoutines();
  const deleteRoutineMutation = useDeleteRoutine();
  const { toast } = useToast();
  const { user } = useAuth();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<{id: string, name: string} | null>(null);

  // Ordina routine: prima quelle assegnate, poi per giorno
  const assignedDaysOrder = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  const routinesSorted = [...routines].sort((a, b) => {
    const aAssigned = a.assigned_days?.length ? 0 : 1;
    const bAssigned = b.assigned_days?.length ? 0 : 1;
    if (aAssigned !== bAssigned) return aAssigned - bAssigned;
    const aDay = assignedDaysOrder.findIndex(day => a.assigned_days?.includes(day));
    const bDay = assignedDaysOrder.findIndex(day => b.assigned_days?.includes(day));
    return aDay - bDay;
  });

  const handleCheckbox = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleExport = async () => {
    const selectedRoutines = routines.filter(r => selectedIds.includes(r.id));
    if (selectedRoutines.length > 0) {
      const mod = await import("@/lib/exportMultipleRoutinesPdf");
      await mod.exportMultipleRoutinesPdf(selectedRoutines, user);
      setExportDialogOpen(false);
      setSelectedIds([]);
    }
  };

  const handleDelete = (routineId: string, routineName: string) => {
    setRoutineToDelete({ id: routineId, name: routineName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!routineToDelete) return;
    try {
      await deleteRoutineMutation.mutateAsync(routineToDelete.id);
      toast({
        title: "Routine eliminata",
        description: `La routine "${routineToDelete.name}" è stata eliminata con successo.`,
      });
      setDeleteDialogOpen(false);
      setRoutineToDelete(null);
      refetch();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione della routine.",
        variant: "destructive",
      });
    }
  };

  const startWorkout = (routine: any) => {
    localStorage.setItem('activeWorkout', JSON.stringify(routine));
    navigate("/training", { state: { routine } });
  };

  // Funzione di calcolo volume dettagliato
  function getRoutineVolume(routine: any) {
    let totalKg = 0;
    let totalSets = 0;
    let totalDuration = 0;
    let totalDistance = 0;
    if (!routine.routine_exercises) return { totalKg, totalSets, totalDuration, totalDistance };
    for (const ex of routine.routine_exercises) {
      if (ex.tracking_type === "sets_reps") {
        totalSets += Number(ex.sets) || 0;
        totalKg += (Number(ex.sets) || 0) * (Number(ex.reps) || 0) * (Number(ex.weight) || 0);
      } else if (ex.tracking_type === "duration") {
        totalDuration += (Number(ex.sets) || 1) * (Number(ex.duration) || 0);
        totalSets += Number(ex.sets) || 1;
      } else if (ex.tracking_type === "distance_duration") {
        totalDuration += (Number(ex.sets) || 1) * (Number(ex.duration) || 0);
        totalDistance += (Number(ex.sets) || 1) * (Number(ex.distance) || 0);
        totalSets += Number(ex.sets) || 1;
      }
    }
    return { totalKg, totalSets, totalDuration, totalDistance };
  }

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
          <div className="flex gap-2">
            <Button 
              onClick={() => setExportDialogOpen(true)}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold"
              variant="outline"
            >
              Export PDF
            </Button>
            <Button 
              onClick={() => navigate("/routines/create")}
              className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Routine
            </Button>
          </div>
        </div>

        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seleziona le routine da esportare</DialogTitle>
            </DialogHeader>
            <div className="max-h-72 overflow-y-auto space-y-2">
              {routinesSorted.map(routine => (
                <div key={routine.id} className={`flex items-center gap-2 p-2 rounded ${routine.assigned_days?.length ? 'bg-green-50' : 'bg-gray-100 opacity-60'}`}>
                  <Checkbox
                    checked={selectedIds.includes(routine.id)}
                    onCheckedChange={() => handleCheckbox(routine.id)}
                    disabled={!routine.assigned_days?.length}
                  />
                  <span className="font-semibold text-gray-900 dark:text-white">{routine.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{routine.assigned_days?.length ? routine.assigned_days.join(', ') : 'Non assegnata'}</span>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                onClick={handleExport}
                disabled={selectedIds.length === 0}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold"
              >
                Esporta selezionate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => navigate(`/routines/${routine.id}`)}>
                      <CardTitle className="text-gray-900 dark:text-white font-outfit mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-200">
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
                
                <CardContent className="flex flex-col h-full justify-between px-5 pb-4 pt-2">
                  {/* Box volume dedicato */}
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-4 mb-2 flex flex-col gap-1 border border-gray-200 dark:border-gray-700">
                    {getRoutineVolume(routine).totalKg > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">Volume (kg)</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{getRoutineVolume(routine).totalKg} kg</span>
                      </div>
                    )}
                    {getRoutineVolume(routine).totalSets > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">Serie totali</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{getRoutineVolume(routine).totalSets}</span>
                      </div>
                    )}
                    {getRoutineVolume(routine).totalDuration > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">Durata totale</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{getRoutineVolume(routine).totalDuration} s</span>
                      </div>
                    )}
                    {getRoutineVolume(routine).totalDistance > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">Distanza totale</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{getRoutineVolume(routine).totalDistance} m</span>
                      </div>
                    )}
                  </div>
                  {/* Exercise Preview */}
                  {routine.routine_exercises?.length > 0 && (
                    <div className="mb-2">
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Esercizi:</div>
                      <div className="space-y-1">
                        {routine.routine_exercises.slice(0, 3).map((routineExercise: any) => (
                          <div key={routineExercise.id} className="flex items-center space-x-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 py-1 transition-colors cursor-pointer">
                            <MuscleIcon 
                              muscleGroup={routineExercise.exercise.muscle_group} 
                              className="w-4 h-4"
                            />
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                              {routineExercise.exercise.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {routineExercise.sets}×{routineExercise.reps || routineExercise.duration}
                            </span>
                          </div>
                        ))}
                        {routine.routine_exercises.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{routine.routine_exercises.length - 3} altri esercizi
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {routine.assigned_days?.length > 0 && (
                    <div className="mb-2">
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Giorni assegnati:</div>
                      <div className="flex flex-wrap gap-2">
                        {routine.assigned_days.slice(0, 3).map((day: string) => (
                          <Badge key={day} variant="secondary" className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                        {routine.assigned_days.length > 3 && (
                          <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            +{routine.assigned_days.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 justify-end bg-white dark:bg-gray-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/routines/${routine.id}`)}
                      className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold px-4 py-2 rounded-lg"
                    >
                      Dettaglio
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => startWorkout(routine)}
                      disabled={!routine.routine_exercises?.length}
                      className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold shadow-md transition-colors px-4 py-2 rounded-lg"
                    >
                      Inizia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog di conferma eliminazione routine */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conferma eliminazione</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Sei sicuro di voler eliminare la routine <span className="font-semibold">{routineToDelete?.name}</span>?<br />
              Questa azione non può essere annullata.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Annulla
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>
                Elimina
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Routines;

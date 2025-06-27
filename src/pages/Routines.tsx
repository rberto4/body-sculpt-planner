import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Target, Play, Edit, Trash2, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoutines, useDeleteRoutine, useCreateRoutine, useAddExerciseToRoutine, useUpdateRoutine, useUpdateRoutineExercise, useRemoveExerciseFromRoutine } from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";
import { MuscleIcon } from "@/hooks/useMuscleIcons";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import RoutineCard from '../components/routines/RoutineCard';
import RoutineForm from '../components/routines/RoutineForm';

const Routines = () => {
  const navigate = useNavigate();
  const { data: routines = [], isLoading, refetch } = useRoutines();
  const deleteRoutineMutation = useDeleteRoutine();
  const { toast } = useToast();
  const { user } = useAuth();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const createRoutineMutation = useCreateRoutine();
  const addExerciseToRoutineMutation = useAddExerciseToRoutine();
  const updateRoutineMutation = useUpdateRoutine();
  const updateRoutineExerciseMutation = useUpdateRoutineExercise();
  const removeExerciseFromRoutineMutation = useRemoveExerciseFromRoutine();

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

  const handleSaveRoutine = async (data: any) => {
    try {
      if (editingRoutine) {
        // MODIFICA ROUTINE
        await updateRoutineMutation.mutateAsync({
          id: editingRoutine.id,
          name: data.name,
          type: data.type,
          assigned_days: data.assigned_days,
        });
        // Gestione esercizi
        const oldExercises = editingRoutine.routine_exercises || [];
        const newExercises = data.routine_exercises;
        // Aggiorna o aggiungi esercizi
        for (let i = 0; i < newExercises.length; i++) {
          const ex = newExercises[i];
          const isSetsReps = ex.tracking_type === 'sets_reps';
          const isDuration = ex.tracking_type === 'duration';
          const isDistanceDuration = ex.tracking_type === 'distance_duration';
          const rpeValue = ex.rpe === '' || ex.rpe == null ? null : Number(ex.rpe);
          const exerciseData = {
            sets: ex.sets,
            reps: isSetsReps ? ex.reps : null,
            weight: isSetsReps ? ex.weight : null,
            weight_unit: isSetsReps ? ex.weight_unit : null,
            duration: (isDuration || isDistanceDuration) ? ex.duration : null,
            duration_unit: (isDuration || isDistanceDuration) ? ex.duration_unit : null,
            distance: isDistanceDuration ? ex.distance : null,
            distance_unit: isDistanceDuration ? ex.distance_unit : null,
            rest_time: ex.rest_time || 60,
            tracking_type: ex.tracking_type,
            rpe: rpeValue,
            mav: ex.mav,
            warmup: ex.warmup,
            notes: ex.notes,
            order_index: i
          };
          if (ex.id) {
            await updateRoutineExerciseMutation.mutateAsync({
              routineExerciseId: ex.id,
              exerciseData
            });
          } else {
            await addExerciseToRoutineMutation.mutateAsync({
              routineId: editingRoutine.id,
              exerciseId: ex.exercise.id,
              exerciseData
            });
          }
        }
        // Rimuovi esercizi eliminati
        const newIds = newExercises.filter(e => e.id).map(e => e.id);
        for (const oldEx of oldExercises) {
          if (!newIds.includes(oldEx.id)) {
            await removeExerciseFromRoutineMutation.mutateAsync(oldEx.id);
          }
        }
      } else {
        // CREAZIONE
        const routine = await createRoutineMutation.mutateAsync({
          name: data.name,
          type: data.type,
          assigned_days: data.assigned_days,
        });
        for (let i = 0; i < data.routine_exercises.length; i++) {
          const ex = data.routine_exercises[i];
          const isSetsReps = ex.tracking_type === 'sets_reps';
          const isDuration = ex.tracking_type === 'duration';
          const isDistanceDuration = ex.tracking_type === 'distance_duration';
          const rpeValue = ex.rpe === '' || ex.rpe == null ? null : Number(ex.rpe);
          const exerciseData = {
            sets: ex.sets,
            reps: isSetsReps ? ex.reps : null,
            weight: isSetsReps ? ex.weight : null,
            weight_unit: isSetsReps ? ex.weight_unit : null,
            duration: (isDuration || isDistanceDuration) ? ex.duration : null,
            duration_unit: (isDuration || isDistanceDuration) ? ex.duration_unit : null,
            distance: isDistanceDuration ? ex.distance : null,
            distance_unit: isDistanceDuration ? ex.distance_unit : null,
            rest_time: ex.rest_time || 60,
            tracking_type: ex.tracking_type,
            rpe: rpeValue,
            mav: ex.mav,
            warmup: ex.warmup,
            notes: ex.notes,
            order_index: i
          };
          await addExerciseToRoutineMutation.mutateAsync({
            routineId: routine.id,
            exerciseId: ex.exercise.id,
            exerciseData
          });
        }
      }
      setDialogOpen(false);
      setEditingRoutine(null);
      refetch();
    } catch (error) {
      // Il toast di errore viene già gestito dagli hook
    }
  };

  const handleDeleteRoutine = async () => {
    if (!routineToDelete) return;
    try {
      await deleteRoutineMutation.mutateAsync(routineToDelete.id);
      toast({
        title: "Routine eliminata",
        description: `La routine "${routineToDelete.name}" è stata eliminata con successo.`,
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Caricamento routine...</div>
      </div>
    );
  }

  // Se non ci sono routine, mostra solo il messaggio centrale
  if (routines.length === 0) {
    if (dialogOpen) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
          <div className="w-full max-w-3xl mx-auto">
            <RoutineForm
              mode="create"
              onSave={handleSaveRoutine}
              onCancel={() => { setDialogOpen(false); setEditingRoutine(null); }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Le mie Routine</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Gestisci i tuoi programmi di allenamento</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setEditingRoutine(null);
                  setDialogOpen(true);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuova Routine
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Dumbbell className="w-16 h-16 mb-4 text-gray-300" />
            <span className="text-gray-400 text-xl">Crea la tua prima routine</span>
          </div>
        </div>
      </div>
    );
  }

  if (dialogOpen) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto">
          <RoutineForm
            mode={editingRoutine ? 'edit' : 'create'}
            routine={editingRoutine}
            onSave={handleSaveRoutine}
            onCancel={() => { setDialogOpen(false); setEditingRoutine(null); }}
          />
        </div>
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
              onClick={() => {
                setEditingRoutine(null);
                setDialogOpen(true);
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Routine
            </Button>
          </div>
        </div>

        {routines.length === 0 ? (
          null
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine: any) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onEdit={() => { setEditingRoutine(routine); setDialogOpen(true); }}
                onDelete={() => setRoutineToDelete(routine)}
                onDetails={() => navigate(`/routines/${routine.id}`)}
                onStart={() => {/* implementa start */}}
              />
            ))}
          </div>
        )}

        {/* Dialog di conferma eliminazione routine */}
        {routineToDelete && (
          <Dialog open={!!routineToDelete} onOpenChange={open => { if (!open) setRoutineToDelete(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Elimina routine</DialogTitle>
              </DialogHeader>
              <div className="py-4">Sei sicuro di voler eliminare la routine <b>{routineToDelete.name}</b>? Questa azione non è reversibile.</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRoutineToDelete(null)}>Annulla</Button>
                <Button variant="destructive" onClick={handleDeleteRoutine}>Elimina</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Routines;

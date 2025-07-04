import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Hook per le routine
export const useRoutines = () => {
  return useQuery({
    queryKey: ['routines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routines')
        .select(`
          *,
          routine_exercises (
            id,
            exercise_id,
            sets,
            reps,
            duration,
            rest_time,
            order_index,
            notes,
            tracking_type,
            weight,
            weight_unit,
            exercise:exercises (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Calculate volume for each routine
      const routinesWithVolume = data?.map(routine => {
        const totalVolume = routine.routine_exercises?.reduce((acc: number, ex: any) => {
          const weight = ex.weight || 0;
          const sets = ex.sets || 0;
          const reps = ex.reps || 0;
          return acc + (weight * sets * reps);
        }, 0) || 0;
        
        return {
          ...routine,
          calculated_volume: totalVolume
        };
      });
      
      return routinesWithVolume;
    },
  });
};

// Hook per gli esercizi
export const useExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook per creare una routine
export const useCreateRoutine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (routineData: any) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('routines')
        .insert({
          ...routineData,
          created_by: user.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({
        title: "Successo!",
        description: "Routine creata con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la creazione della routine.",
        variant: "destructive",
      });
    },
  });
};

// Hook per aggiornare una routine
export const useUpdateRoutine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...routineData }: { id: string } & any) => {
      const { data, error } = await supabase
        .from('routines')
        .update(routineData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({
        title: "Successo!",
        description: "Routine aggiornata con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento della routine.",
        variant: "destructive",
      });
    },
  });
};

// Hook per eliminare una routine
export const useDeleteRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', routineId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
};

// Hook per creare un esercizio
export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exerciseData: any) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('exercises')
        .insert({
          ...exerciseData,
          created_by: user.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: "Successo!",
        description: "Esercizio creato con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la creazione dell'esercizio.",
        variant: "destructive",
      });
    },
  });
};

// Hook per aggiungere esercizi a una routine (updated)
export const useAddExerciseToRoutine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ routineId, exerciseId, exerciseData }: {
      routineId: string;
      exerciseId: string;
      exerciseData: {
        sets: number;
        reps?: number;
        duration?: number;
        duration_unit?: string;
        distance?: number;
        distance_unit?: string;
        rest_time: number;
        tracking_type: string;
        weight?: number;
        weight_unit?: string;
        rpe?: number;
        mav?: boolean;
        warmup?: boolean;
        notes?: string;
        order_index: number;
      };
    }) => {
      const { data, error } = await supabase
        .from('routine_exercises')
        .insert({
          routine_id: routineId,
          exercise_id: exerciseId,
          ...exerciseData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({
        title: "Successo!",
        description: "Esercizio aggiunto alla routine.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiunta dell'esercizio.",
        variant: "destructive",
      });
    },
  });
};

// Hook per aggiornare un esercizio in una routine
export const useUpdateRoutineExercise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      routineExerciseId, 
      exerciseData 
    }: {
      routineExerciseId: string;
      exerciseData: {
        sets?: number;
        reps?: number;
        duration?: number;
        duration_unit?: string;
        distance?: number;
        distance_unit?: string;
        rest_time?: number;
        tracking_type?: string;
        weight?: number;
        weight_unit?: string;
        rpe?: number;
        mav?: boolean;
        warmup?: boolean;
        notes?: string;
        order_index?: number;
      };
    }) => {
      const { data, error } = await supabase
        .from('routine_exercises')
        .update(exerciseData)
        .eq('id', routineExerciseId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['routine'] });
      toast({
        title: "Successo!",
        description: "Esercizio aggiornato con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento dell'esercizio.",
        variant: "destructive",
      });
    },
  });
};

// Hook per eliminare un esercizio da una routine
export const useRemoveExerciseFromRoutine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (routineExerciseId: string) => {
      const { error } = await supabase
        .from('routine_exercises')
        .delete()
        .eq('id', routineExerciseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['routine'] });
      toast({
        title: "Successo!",
        description: "Esercizio rimosso dalla routine.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la rimozione dell'esercizio.",
        variant: "destructive",
      });
    },
  });
};

// Hook per i workout
export const useWorkouts = () => {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          routine:routines (*),
          workout_exercises (
            *,
            exercise:exercises (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook per creare un workout
export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (workoutData: { routineId: string; exercises: any[] }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Crea il workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          routine_id: workoutData.routineId,
          user_id: user.user.id,
          completed_at: new Date().toISOString(),
          is_completed: true
        })
        .select()
        .single();
      
      if (workoutError) throw workoutError;

      // Salva gli esercizi completati
      const workoutExercises = workoutData.exercises.map(exercise => ({
        workout_id: workout.id,
        exercise_id: exercise.exercise_id,
        routine_exercise_id: exercise.routine_exercise_id,
        sets_completed: exercise.sets_completed,
        reps_completed: exercise.reps_completed,
        weight_used: exercise.weight_used,
        duration_completed: exercise.duration_completed,
        is_completed: exercise.is_completed,
        is_skipped: exercise.is_skipped,
        notes: exercise.notes
      }));

      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercises);

      if (exercisesError) throw exercisesError;

      return workout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: "Ottimo lavoro!",
        description: "Workout completato e salvato con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante il salvataggio del workout.",
        variant: "destructive",
      });
    },
  });
};

// Hook per ottenere una routine specifica
export const useRoutine = (id: string) => {
  return useQuery({
    queryKey: ['routine', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routines')
        .select(`
          *,
          routine_exercises (
            id,
            exercise_id,
            sets,
            reps,
            duration,
            rest_time,
            order_index,
            notes,
            tracking_type,
            exercise:exercises (*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

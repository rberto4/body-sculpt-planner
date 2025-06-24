
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
            sets,
            reps,
            duration,
            rest_time,
            order_index,
            exercise:exercises (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('routines')
        .insert(routineData)
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

// Hook per creare un esercizio
export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exerciseData: any) => {
      const { data, error } = await supabase
        .from('exercises')
        .insert(exerciseData)
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

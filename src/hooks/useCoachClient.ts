
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Hook per ottenere i clienti di un coach
export const useCoachClients = () => {
  return useQuery({
    queryKey: ['coach-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coach_clients')
        .select(`
          *,
          client:profiles!client_id (
            id,
            full_name,
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook per ottenere i codici di invito di un coach
export const useCoachInviteCodes = () => {
  return useQuery({
    queryKey: ['coach-invite-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coach_invite_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook per creare un codice di invito
export const useCreateInviteCode = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ clientName, clientEmail }: { clientName: string; clientEmail: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Genera un codice univoco
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { data, error } = await supabase
        .from('coach_invite_codes')
        .insert({
          coach_id: user.user.id,
          code,
          client_name: clientName,
          client_email: clientEmail
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-invite-codes'] });
      toast({
        title: "Codice creato!",
        description: "Il codice di invito è stato generato con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la creazione del codice.",
        variant: "destructive",
      });
    },
  });
};

// Hook per eliminare un cliente
export const useRemoveClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from('coach_clients')
        .delete()
        .eq('client_id', clientId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-clients'] });
      toast({
        title: "Cliente rimosso",
        description: "Il cliente è stato rimosso con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la rimozione del cliente.",
        variant: "destructive",
      });
    },
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Hook per ottenere i messaggi della chat
export const useChatMessages = (otherUserId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['chat-messages', otherUserId],
    queryFn: async () => {
      if (!user || !otherUserId) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            full_name
          )
        `)
        .or(`and(coach_id.eq.${user.id},client_id.eq.${otherUserId}),and(coach_id.eq.${otherUserId},client_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!otherUserId,
  });
};

// Hook per inviare un messaggio
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({ message, otherUserId }: { message: string; otherUserId: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Determina chi è il coach e chi è il client
      const isCoach = profile?.role === 'coach';
      const coachId = isCoach ? user.id : otherUserId;
      const clientId = isCoach ? otherUserId : user.id;

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          coach_id: coachId,
          client_id: clientId,
          sender_id: user.id,
          message
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.otherUserId] });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'invio del messaggio.",
        variant: "destructive",
      });
    },
  });
};

// Hook per ottenere le conversazioni (per coach)
export const useChatConversations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['chat-conversations'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('coach_clients')
        .select(`
          client:profiles!client_id (
            id,
            full_name
          )
        `);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

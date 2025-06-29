
-- Aggiornare la funzione handle_new_user per gestire i ruoli e i codici di invito
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  invite_record RECORD;
BEGIN
  -- Inserire il profilo utente
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  
  -- Se è un client con codice di invito, gestire la relazione coach-cliente
  IF NEW.raw_user_meta_data->>'role' = 'client' AND NEW.raw_user_meta_data->>'invite_code' IS NOT NULL THEN
    -- Trovare il codice di invito
    SELECT * INTO invite_record
    FROM public.coach_invite_codes
    WHERE code = NEW.raw_user_meta_data->>'invite_code'
      AND is_used = false
      AND expires_at > now();
    
    IF invite_record IS NOT NULL THEN
      -- Creare la relazione coach-cliente
      INSERT INTO public.coach_clients (coach_id, client_id)
      VALUES (invite_record.coach_id, NEW.id);
      
      -- Marcare il codice come utilizzato
      UPDATE public.coach_invite_codes
      SET is_used = true, used_by = NEW.id
      WHERE id = invite_record.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

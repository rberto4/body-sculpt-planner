
-- Creare enum per i ruoli utente
CREATE TYPE public.user_role AS ENUM ('coach', 'client');

-- Aggiungere colonna role alla tabella profiles
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role DEFAULT 'client',
ADD COLUMN coach_code TEXT UNIQUE;

-- Creare tabella per le relazioni coach-cliente
CREATE TABLE public.coach_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(coach_id, client_id)
);

-- Creare tabella per i codici di invito dei coach
CREATE TABLE public.coach_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days') NOT NULL
);

-- Creare tabella per la chat
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Modificare tabella routines per includere client_id
ALTER TABLE public.routines 
ADD COLUMN client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Aggiornare le routine esistenti per avere client_id = created_by (per compatibilità)
UPDATE public.routines SET client_id = created_by WHERE client_id IS NULL;

-- Abilitare RLS per le nuove tabelle
ALTER TABLE public.coach_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies per coach_clients
CREATE POLICY "Coach can manage their clients" ON public.coach_clients
  FOR ALL USING (auth.uid() = coach_id);

CREATE POLICY "Client can view their coach relationship" ON public.coach_clients
  FOR SELECT USING (auth.uid() = client_id);

-- Policies per coach_invite_codes
CREATE POLICY "Coach can manage their invite codes" ON public.coach_invite_codes
  FOR ALL USING (auth.uid() = coach_id);

CREATE POLICY "Anyone can view unused codes for registration" ON public.coach_invite_codes
  FOR SELECT USING (NOT is_used AND expires_at > now());

-- Policies per chat_messages
CREATE POLICY "Coach and client can view their messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = coach_id OR auth.uid() = client_id);

CREATE POLICY "Coach and client can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND 
    (auth.uid() = coach_id OR auth.uid() = client_id)
  );

-- Aggiornare policies per routines
DROP POLICY IF EXISTS "Users can view their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can create their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can update their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can delete their own routines" ON public.routines;

CREATE POLICY "Coach can manage client routines" ON public.routines
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Client can view assigned routines" ON public.routines
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Client can update routine assigned days" ON public.routines
  FOR UPDATE USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Funzione per generare codici univoci
CREATE OR REPLACE FUNCTION public.generate_coach_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE coach_code = new_code);
  END LOOP;
  RETURN new_code;
END;
$$;

-- Trigger per generare automaticamente coach_code quando un utente si registra come coach
CREATE OR REPLACE FUNCTION public.set_coach_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role = 'coach' AND NEW.coach_code IS NULL THEN
    NEW.coach_code := public.generate_coach_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_coach_code_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_coach_code();

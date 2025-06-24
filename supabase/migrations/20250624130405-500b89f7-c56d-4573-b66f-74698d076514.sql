
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routines table
CREATE TABLE public.routines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  assigned_days TEXT[] DEFAULT '{}',
  is_assigned BOOLEAN DEFAULT false,
  volume TEXT DEFAULT 'Medium',
  created_by UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routine_exercises table (junction table)
CREATE TABLE public.routine_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID REFERENCES public.routines ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises ON DELETE CASCADE NOT NULL,
  sets INTEGER NOT NULL DEFAULT 1,
  reps INTEGER,
  duration INTEGER,
  rest_time INTEGER DEFAULT 60,
  weight DECIMAL,
  notes TEXT,
  tracking_type TEXT NOT NULL DEFAULT 'sets_reps', -- 'sets_reps', 'duration', 'distance'
  order_index INTEGER NOT NULL DEFAULT 0,
  is_superset BOOLEAN DEFAULT false,
  superset_group INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workouts table (completed workouts)
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID REFERENCES public.routines ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_exercises table (tracking individual exercise performance)
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises ON DELETE CASCADE NOT NULL,
  routine_exercise_id UUID REFERENCES public.routine_exercises ON DELETE CASCADE NOT NULL,
  sets_completed INTEGER DEFAULT 0,
  reps_completed INTEGER[],
  weight_used DECIMAL[],
  duration_completed INTEGER,
  is_completed BOOLEAN DEFAULT false,
  is_skipped BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for exercises
CREATE POLICY "Users can view all exercises" ON public.exercises
  FOR SELECT USING (true);

CREATE POLICY "Users can create exercises" ON public.exercises
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own exercises" ON public.exercises
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own exercises" ON public.exercises
  FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for routines
CREATE POLICY "Users can view their own routines" ON public.routines
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create routines" ON public.routines
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own routines" ON public.routines
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own routines" ON public.routines
  FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for routine_exercises
CREATE POLICY "Users can view routine exercises" ON public.routine_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.routines 
      WHERE routines.id = routine_exercises.routine_id 
      AND routines.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage routine exercises" ON public.routine_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.routines 
      WHERE routines.id = routine_exercises.routine_id 
      AND routines.created_by = auth.uid()
    )
  );

-- Create RLS policies for workouts
CREATE POLICY "Users can view their own workouts" ON public.workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create workouts" ON public.workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" ON public.workouts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for workout_exercises
CREATE POLICY "Users can view their workout exercises" ON public.workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their workout exercises" ON public.workout_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default exercises
INSERT INTO public.exercises (name, muscle_group, type, description, created_by) VALUES
  ('Push-ups', 'Chest', 'Push', 'Classic bodyweight chest exercise', null),
  ('Pull-ups', 'Back', 'Pull', 'Upper body pulling exercise', null),
  ('Squats', 'Legs', 'Legs', 'Fundamental lower body exercise', null),
  ('Plank', 'Core', 'Core', 'Isometric core strengthening exercise', null),
  ('Pike Push-ups', 'Shoulders', 'Push', 'Shoulder-focused push-up variation', null),
  ('Diamond Push-ups', 'Triceps', 'Push', 'Tricep-focused push-up variation', null),
  ('Mountain Climbers', 'Core', 'Cardio', 'High-intensity cardio exercise', null),
  ('Burpees', 'Full Body', 'Cardio', 'Full body cardio exercise', null);

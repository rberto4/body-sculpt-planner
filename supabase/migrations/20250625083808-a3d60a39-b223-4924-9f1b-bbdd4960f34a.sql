
-- Add weight support to routine_exercises
ALTER TABLE routine_exercises 
ADD COLUMN weight_unit text DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb'));

-- Add RPE and other training parameters
ALTER TABLE routine_exercises 
ADD COLUMN rpe integer CHECK (rpe >= 1 AND rpe <= 10),
ADD COLUMN mav boolean DEFAULT false,
ADD COLUMN warmup boolean DEFAULT false;

-- Add distance tracking support
ALTER TABLE routine_exercises 
ADD COLUMN distance numeric,
ADD COLUMN distance_unit text DEFAULT 'm' CHECK (distance_unit IN ('m', 'km', 'mi')),
ADD COLUMN duration_unit text DEFAULT 'seconds' CHECK (duration_unit IN ('seconds', 'minutes'));

-- Update tracking_type to include new options
ALTER TABLE routine_exercises 
DROP CONSTRAINT IF EXISTS routine_exercises_tracking_type_check,
ADD CONSTRAINT routine_exercises_tracking_type_check 
CHECK (tracking_type IN ('sets_reps', 'duration', 'distance_duration'));

-- Add corresponding columns to workout_exercises for tracking actual performance
ALTER TABLE workout_exercises 
ADD COLUMN weight_used_values numeric[],
ADD COLUMN distance_completed numeric,
ADD COLUMN actual_rpe integer;

-- Update volume calculation - we'll calculate this in the application
ALTER TABLE routines 
ADD COLUMN calculated_volume integer DEFAULT 0;

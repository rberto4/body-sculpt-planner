import { ExerciseBuilderDialog } from "./ExerciseBuilderDialog";

interface RoutineBuilderProps {
  routineId?: string;
  existingExercises?: any[];
  onExerciseAdded?: () => void;
}

export const RoutineBuilder = ({ routineId, existingExercises = [], onExerciseAdded }: RoutineBuilderProps) => {
  return (
    <ExerciseBuilderDialog
      routineId={routineId}
      existingExercises={existingExercises}
      onExerciseAdded={onExerciseAdded}
    />
  );
};

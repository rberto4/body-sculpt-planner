import React from 'react';
import { Button } from '../ui/button';
import { Trash, Edit3 } from 'lucide-react';
// TODO: importa MuscleIcon se disponibile

function getExerciseDetails(ex: any) {
  if (ex.tracking_type === 'sets_reps') {
    return `${ex.sets}×${ex.reps} rip - ${ex.weight || 0}${ex.weight_unit || 'kg'}`;
  }
  if (ex.tracking_type === 'duration') {
    return `${ex.duration || 0} ${ex.duration_unit === 'minutes' ? 'min' : 's'}`;
  }
  if (ex.tracking_type === 'distance_duration') {
    return `${ex.distance || 0}${ex.distance_unit || 'm'} in ${ex.duration || 0}${ex.duration_unit === 'minutes' ? 'min' : 's'}`;
  }
  return '';
}

export default function RoutineExerciseList({ exercises, onEdit, onRemove }: {
  exercises: any[],
  onEdit?: (exercise: any, idx: number) => void,
  onRemove?: (idx: number) => void
}) {
  if (!exercises || exercises.length === 0) {
    return <div className="text-gray-400 text-sm">Nessun esercizio aggiunto</div>;
  }
  return (
    <div className="space-y-2">
      {exercises.map((ex, idx) => (
        <div key={idx} className="flex items-center bg-gray-50 rounded px-3 py-2 shadow-sm">
          {/* <MuscleIcon muscleGroup={ex.exercise?.muscle_group} className="w-5 h-5 mr-2" /> */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{ex.exercise?.name}</div>
            <div className="text-xs text-gray-600 truncate">{getExerciseDetails(ex)}</div>
            {ex.notes && <div className="text-xs text-gray-400 italic truncate">{ex.notes}</div>}
          </div>
          {onEdit && (
            <Button type="button" size="icon" variant="ghost" onClick={() => onEdit(ex, idx)}>
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          {onRemove && (
            <Button type="button" size="icon" variant="ghost" onClick={() => onRemove(idx)}>
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
} 
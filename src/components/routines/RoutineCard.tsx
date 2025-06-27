import React from 'react';
import { Button } from '../ui/button';
import { Pencil, Trash, Info, Play } from 'lucide-react';
import RoutineExerciseList from './RoutineExerciseList';

export default function RoutineCard({
  routine,
  onEdit,
  onDelete,
  onDetails,
  onStart
}: {
  routine: any,
  onEdit?: () => void,
  onDelete?: () => void,
  onDetails?: () => void,
  onStart?: () => void
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow border border-gray-200 transition-shadow flex flex-col h-full cursor-pointer hover:shadow-lg ${onDetails ? 'hover:ring-2 hover:ring-blue-400' : ''}`}
      onClick={onDetails}
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-gray-900 truncate">{routine.name}</div>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">{routine.type}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {routine.assigned_days && routine.assigned_days.length > 0 && routine.assigned_days.map((day: string) => (
            <span key={day} className="text-xs bg-gray-200 rounded px-2 py-0.5 text-gray-700">{day.slice(0,3)}</span>
          ))}
        </div>
        {routine.calculated_volume && (
          <div className="text-xs text-gray-500 mb-2">Volume: <span className="font-semibold">{routine.calculated_volume}</span></div>
        )}
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Esercizi:</div>
          <RoutineExerciseList exercises={routine.routine_exercises?.slice(0, 3) || []} />
          {routine.routine_exercises && routine.routine_exercises.length > 3 && (
            <div className="text-xs text-gray-400 mt-1">+{routine.routine_exercises.length - 3} altri esercizi</div>
          )}
        </div>
      </div>
      <div className="flex gap-2 p-3 border-t border-gray-100 bg-gray-50 justify-end">
        {onDetails && (
          <Button size="icon" variant="ghost" title="Dettagli" onClick={e => { e.stopPropagation(); onDetails(); }}>
            <Info className="w-4 h-4" />
          </Button>
        )}
        {onStart && (
          <Button size="icon" variant="ghost" title="Inizia" onClick={e => { e.stopPropagation(); onStart && onStart(); }}><Play className="w-4 h-4" /></Button>
        )}
        {onEdit && (
          <Button size="icon" variant="ghost" title="Modifica" onClick={e => { e.stopPropagation(); onEdit(); }}><Pencil className="w-4 h-4" /></Button>
        )}
        {onDelete && (
          <Button size="icon" variant="ghost" title="Elimina" onClick={e => { e.stopPropagation(); onDelete(); }}><Trash className="w-4 h-4 text-red-500" /></Button>
        )}
      </div>
    </div>
  );
} 
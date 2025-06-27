import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import RoutineExerciseList from './RoutineExerciseList';
import RoutineExerciseForm from './RoutineExerciseForm';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { ArrowLeft } from 'lucide-react';

const ROUTINE_TYPES = [
  'Forza', 'Cardio', 'Full Body', 'Push', 'Pull', 'Gambe', 'Core', 'Spalle', 'Totalbody', 'Altro'
];
const DAYS = [
  'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'
];

export default function RoutineForm({
  mode = 'create',
  routine = null,
  onSave,
  onCancel
}: {
  mode?: 'create' | 'edit',
  routine?: any,
  onSave: (data: any) => void,
  onCancel: () => void
}) {
  const [name, setName] = useState(routine?.name || '');
  const [type, setType] = useState(routine?.type || ROUTINE_TYPES[0]);
  const [assignedDays, setAssignedDays] = useState<string[]>(routine?.assigned_days || []);
  const [exercises, setExercises] = useState<any[]>(routine?.routine_exercises || []);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);

  const handleAddExercise = (exercise: any) => {
    setExercises(prev => [...prev, exercise]);
    setExerciseDialogOpen(false);
  };
  const handleEditExercise = (exercise: any, idx: number) => {
    setExercises(prev => prev.map((ex, i) => i === idx ? exercise : ex));
    setEditingExercise(null);
    setExerciseDialogOpen(false);
  };
  const handleRemoveExercise = (idx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };
  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return;
    onSave({
      name,
      type,
      assigned_days: assignedDays,
      routine_exercises: exercises
    });
  };

  if (exerciseDialogOpen) {
    return (
      <RoutineExerciseForm
        exercise={editingExercise}
        onSave={ex => {
          if (editingExercise) handleEditExercise(ex, exercises.findIndex(e => e === editingExercise));
          else handleAddExercise(ex);
        }}
        onCancel={() => { setEditingExercise(null); setExerciseDialogOpen(false); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con titolo e tasto indietro */}
      <div className="flex items-center mb-2">
        <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="mr-3">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-0 leading-tight">
            {mode === 'edit' ? 'Modifica routine' : 'Crea routine'}
          </h1>
          <div className="text-sm text-gray-500 mt-0.5">
            Inserisci i dettagli della routine e aggiungi gli esercizi previsti
          </div>
        </div>
      </div>

      {/* Sezione nome e tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Dettagli routine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome routine</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROUTINE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sezione giorni assegnati */}
      <Card>
        <CardHeader>
          <CardTitle>Giorni assegnati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <Button key={day} type="button" size="sm" variant={assignedDays.includes(day) ? 'default' : 'outline'}
                onClick={() => setAssignedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}>
                {day}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sezione esercizi */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Esercizi</CardTitle>
          <Button type="button" size="sm" onClick={() => { setEditingExercise(null); setExerciseDialogOpen(true); }}>
            Aggiungi esercizio
          </Button>
        </CardHeader>
        <CardContent>
          <RoutineExerciseList
            exercises={exercises}
            onEdit={ex => { setEditingExercise(ex); setExerciseDialogOpen(true); }}
            onRemove={handleRemoveExercise}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annulla</Button>
        <Button type="button" onClick={handleSave} disabled={!name.trim() || exercises.length === 0}>
          {mode === 'edit' ? 'Salva modifiche' : 'Crea routine'}
        </Button>
      </div>
    </div>
  );
} 
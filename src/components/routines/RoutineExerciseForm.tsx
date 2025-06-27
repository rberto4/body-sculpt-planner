import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useExercises } from '../../hooks/useSupabaseQuery';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { ArrowLeft } from 'lucide-react';

const TRACKING_TYPES = [
  { value: 'sets_reps', label: 'Serie + Ripetizioni + Carico' },
  { value: 'duration', label: 'Durata' },
  { value: 'distance_duration', label: 'Distanza + Durata' }
];

export default function RoutineExerciseForm({
  exercise = null,
  onSave,
  onCancel
}: {
  exercise?: any,
  onSave: (data: any) => void,
  onCancel: () => void
}) {
  const { data: exercisesList = [] } = useExercises();
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(exercise?.exercise || null);
  const [trackingType, setTrackingType] = useState(exercise?.tracking_type || 'sets_reps');
  const [sets, setSets] = useState(exercise?.sets || 3);
  const [reps, setReps] = useState(exercise?.reps || 10);
  const [weight, setWeight] = useState(exercise?.weight || 0);
  const [weightUnit, setWeightUnit] = useState(exercise?.weight_unit || 'kg');
  const [duration, setDuration] = useState(exercise?.duration || 0);
  const [durationUnit, setDurationUnit] = useState(exercise?.duration_unit || 'seconds');
  const [distance, setDistance] = useState(exercise?.distance || 0);
  const [distanceUnit, setDistanceUnit] = useState(exercise?.distance_unit || 'm');
  const [notes, setNotes] = useState(exercise?.notes || '');
  const [rpe, setRpe] = useState(exercise?.rpe || '');
  const [mav, setMav] = useState(exercise?.mav || false);
  const [warmup, setWarmup] = useState(exercise?.warmup || false);

  useEffect(() => {
    if (selectedExercise && selectedExercise.default_tracking_type) {
      setTrackingType(selectedExercise.default_tracking_type);
    }
  }, [selectedExercise]);

  const filteredExercises = exercisesList.filter((ex: any) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedExercise) return;
    onSave({
      exercise: selectedExercise,
      tracking_type: trackingType,
      sets,
      reps,
      weight,
      weight_unit: weightUnit,
      duration,
      duration_unit: durationUnit,
      distance,
      distance_unit: distanceUnit,
      notes,
      rpe,
      mav,
      warmup
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
      <form className="w-full max-w-3xl mx-auto space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        {/* Header */}
        <div className="flex items-center mb-2">
          <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">
            {exercise ? 'Modifica esercizio' : 'Aggiungi esercizio'}
          </h1>
        </div>
        {/* Sezione 1: Selezione esercizio */}
        <Card>
          <CardHeader>
            <CardTitle>Seleziona esercizio</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Cerca esercizio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-40 overflow-y-auto border rounded bg-white shadow-sm">
              {filteredExercises.length === 0 && (
                <div className="text-gray-400 text-sm p-2">Nessun esercizio trovato</div>
              )}
              {filteredExercises.map((ex: any) => (
                <div
                  key={ex.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${selectedExercise?.id === ex.id ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelectedExercise(ex)}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{ex.name}</div>
                    <div className="text-xs text-gray-500">{ex.muscle_group} • {ex.type}</div>
                  </div>
                </div>
              ))}
            </div>
            {selectedExercise && (
              <div className="text-xs text-green-700 mt-1">Selezionato: {selectedExercise.name}</div>
            )}
          </CardContent>
        </Card>
        {/* Sezione 2: Tipo tracciamento */}
        <Card>
          <CardHeader>
            <CardTitle>Tipo tracciamento</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={trackingType} onValueChange={setTrackingType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRACKING_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        {/* Sezione 3: Parametri */}
        <Card>
          <CardHeader>
            <CardTitle>Parametri esercizio</CardTitle>
          </CardHeader>
          <CardContent>
            {trackingType === 'sets_reps' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Serie</label>
                  <Input type="number" min={1} value={sets} onChange={e => setSets(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ripetizioni</label>
                  <Input type="number" min={1} value={reps} onChange={e => setReps(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Carico</label>
                  <Input type="number" min={0} value={weight} onChange={e => setWeight(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unità</label>
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {trackingType === 'duration' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Durata</label>
                  <Input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unità</label>
                  <Select value={durationUnit} onValueChange={setDurationUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">secondi</SelectItem>
                      <SelectItem value="minutes">minuti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {trackingType === 'distance_duration' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Distanza</label>
                  <Input type="number" min={1} value={distance} onChange={e => setDistance(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unità distanza</label>
                  <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">metri</SelectItem>
                      <SelectItem value="km">km</SelectItem>
                      <SelectItem value="mi">miglia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durata</label>
                  <Input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unità durata</label>
                  <Select value={durationUnit} onValueChange={setDurationUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">secondi</SelectItem>
                      <SelectItem value="minutes">minuti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Sezione 4: Note e flag */}
        <Card>
          <CardHeader>
            <CardTitle>Note e parametri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="min-h-24" placeholder="Aggiungi eventuali note..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RPE</label>
                <Input type="number" min={1} max={10} value={rpe} onChange={e => setRpe(e.target.value)} className="mb-4" />
                <div className="flex flex-col gap-2 mt-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={mav} onChange={e => setMav(e.target.checked)} />
                    MAV (Massima accelerazione volontaria)
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={warmup} onChange={e => setWarmup(e.target.checked)} />
                    Warmup (Riscaldamento)
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Annulla</Button>
          <Button type="submit" disabled={!selectedExercise}>Salva</Button>
        </div>
      </form>
    </div>
  );
} 

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, GripVertical } from "lucide-react";
import { useExercises, useAddExerciseToRoutine } from "@/hooks/useSupabaseQuery";

interface RoutineBuilderProps {
  routineId?: string;
  existingExercises?: any[];
  onExerciseAdded?: () => void;
}

export const RoutineBuilder = ({ routineId, existingExercises = [], onExerciseAdded }: RoutineBuilderProps) => {
  const { data: exercises = [] } = useExercises();
  const addExerciseMutation = useAddExerciseToRoutine();
  
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [duration, setDuration] = useState(30);
  const [restTime, setRestTime] = useState(60);
  const [trackingType, setTrackingType] = useState("sets_reps");
  const [notes, setNotes] = useState("");

  const filteredExercises = exercises.filter(exercise => 
    !existingExercises.some(existing => existing.exercise.id === exercise.id)
  );

  const handleAddExercise = async () => {
    if (!selectedExercise || !routineId) return;

    const exerciseData = {
      sets,
      reps: trackingType === "sets_reps" ? reps : undefined,
      duration: trackingType === "duration" ? duration : undefined,
      rest_time: restTime,
      tracking_type: trackingType,
      notes,
      order_index: existingExercises.length
    };

    try {
      await addExerciseMutation.mutateAsync({
        routineId,
        exerciseId: selectedExercise,
        exerciseData
      });
      
      // Reset form
      setSelectedExercise("");
      setSets(3);
      setReps(12);
      setDuration(30);
      setRestTime(60);
      setNotes("");
      
      onExerciseAdded?.();
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white font-outfit">Aggiungi Esercizio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exercise Selection */}
        <div>
          <Label className="text-slate-300">Seleziona Esercizio</Label>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Scegli un esercizio..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {filteredExercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id} className="text-white hover:bg-slate-700">
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-slate-400">{exercise.muscle_group}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tracking Type */}
        <div>
          <Label className="text-slate-300">Tipo di Tracciamento</Label>
          <Select value={trackingType} onValueChange={setTrackingType}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="sets_reps" className="text-white">Set e Ripetizioni</SelectItem>
              <SelectItem value="duration" className="text-white">Durata</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Exercise Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Set</Label>
            <Input
              type="number"
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              className="bg-white/10 border-white/20 text-white"
              min="1"
              max="10"
            />
          </div>
          
          {trackingType === "sets_reps" ? (
            <div>
              <Label className="text-slate-300">Ripetizioni</Label>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="bg-white/10 border-white/20 text-white"
                min="1"
                max="100"
              />
            </div>
          ) : (
            <div>
              <Label className="text-slate-300">Durata (secondi)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-white/10 border-white/20 text-white"
                min="5"
                max="300"
              />
            </div>
          )}
        </div>

        <div>
          <Label className="text-slate-300">Tempo di Riposo (secondi)</Label>
          <Input
            type="number"
            value={restTime}
            onChange={(e) => setRestTime(Number(e.target.value))}
            className="bg-white/10 border-white/20 text-white"
            min="0"
            max="300"
          />
        </div>

        {/* Notes */}
        <div>
          <Label className="text-slate-300">Note (opzionale)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Aggiungi note per questo esercizio..."
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            rows={2}
          />
        </div>

        <Button
          onClick={handleAddExercise}
          disabled={!selectedExercise || !routineId || addExerciseMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          {addExerciseMutation.isPending ? "Aggiungendo..." : "Aggiungi Esercizio"}
        </Button>
      </CardContent>
    </Card>
  );
};

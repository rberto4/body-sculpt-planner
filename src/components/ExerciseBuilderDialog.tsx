
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useExercises, useAddExerciseToRoutine } from "@/hooks/useSupabaseQuery";
import { CreateExerciseDialog } from "./CreateExerciseDialog";
import { MuscleIcon } from "@/hooks/useMuscleIcons";

interface ExerciseBuilderDialogProps {
  routineId?: string;
  existingExercises?: any[];
  onExerciseAdded?: () => void;
}

export const ExerciseBuilderDialog = ({ routineId, existingExercises = [], onExerciseAdded }: ExerciseBuilderDialogProps) => {
  const { data: exercises = [], refetch: refetchExercises } = useExercises();
  const addExerciseMutation = useAddExerciseToRoutine();
  
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("seconds");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("m");
  const [restTime, setRestTime] = useState("");
  const [trackingType, setTrackingType] = useState("sets_reps");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [rpe, setRpe] = useState("");
  const [mav, setMav] = useState(false);
  const [warmup, setWarmup] = useState(false);
  const [notes, setNotes] = useState("");

  const filteredExercises = exercises.filter(exercise => 
    !existingExercises.some(existing => existing.exercise?.id === exercise.id || existing.exercise_id === exercise.id)
  );

  const handleExerciseCreated = (newExercise: any) => {
    refetchExercises();
    setSelectedExercise(newExercise.id);
  };

  const handleAddExercise = async () => {
    if (!selectedExercise || !routineId) return;

    const exerciseData = {
      sets: parseInt(sets) || 3,
      reps: trackingType === "sets_reps" ? parseInt(reps) || 12 : undefined,
      duration: trackingType === "duration" || trackingType === "distance_duration" ? parseInt(duration) || 30 : undefined,
      duration_unit: durationUnit,
      distance: trackingType === "distance_duration" ? parseInt(distance) || 100 : undefined,
      distance_unit: distanceUnit,
      rest_time: parseInt(restTime) || 60,
      tracking_type: trackingType,
      weight: trackingType === "sets_reps" && weight ? parseFloat(weight) : undefined,
      weight_unit: weightUnit,
      rpe: trackingType === "sets_reps" && rpe ? parseInt(rpe) : undefined,
      mav: trackingType === "sets_reps" ? mav : false,
      warmup: trackingType === "sets_reps" ? warmup : false,
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
      setSets("");
      setReps("");
      setDuration("");
      setDistance("");
      setRestTime("");
      setWeight("");
      setRpe("");
      setMav(false);
      setWarmup(false);
      setNotes("");
      setOpen(false);
      
      onExerciseAdded?.();
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi Esercizio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="font-outfit">Aggiungi Esercizio alla Routine</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Exercise Selection with Create Option */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-700 dark:text-gray-300">Seleziona Esercizio</Label>
              <CreateExerciseDialog onExerciseCreated={handleExerciseCreated} trigger="icon" />
            </div>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Scegli un esercizio..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                {filteredExercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <MuscleIcon muscleGroup={exercise.muscle_group} className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{exercise.muscle_group}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tracking Type */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Tipo di Tracciamento</Label>
            <Select value={trackingType} onValueChange={setTrackingType}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="sets_reps" className="text-gray-900 dark:text-white">Set e Ripetizioni</SelectItem>
                <SelectItem value="duration" className="text-gray-900 dark:text-white">Solo Durata</SelectItem>
                <SelectItem value="distance_duration" className="text-gray-900 dark:text-white">Distanza e Durata</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exercise Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Set</Label>
              <Input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                min="1"
                max="10"
                placeholder="3"
              />
            </div>
            
            {trackingType === "sets_reps" && (
              <>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Ripetizioni</Label>
                  <Input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    min="1"
                    max="100"
                    placeholder="12"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Carico</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      min="0"
                      step="0.5"
                      placeholder="0"
                    />
                    <Select value={weightUnit} onValueChange={setWeightUnit}>
                      <SelectTrigger className="w-20 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">lb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {(trackingType === "duration" || trackingType === "distance_duration") && (
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Durata</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    min="1"
                    placeholder="30"
                  />
                  <Select value={durationUnit} onValueChange={setDurationUnit}>
                    <SelectTrigger className="w-24 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">sec</SelectItem>
                      <SelectItem value="minutes">min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {trackingType === "distance_duration" && (
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Distanza</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    min="1"
                    placeholder="100"
                  />
                  <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                    <SelectTrigger className="w-20 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="km">km</SelectItem>
                      <SelectItem value="mi">mi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Tempo di Riposo (secondi)</Label>
            <Input
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              min="0"
              max="600"
              placeholder="60"
            />
          </div>

          {/* Advanced Settings - Solo per sets_reps */}
          {trackingType === "sets_reps" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300">RPE (1-10)</Label>
                <Input
                  type="number"
                  value={rpe}
                  onChange={(e) => setRpe(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  min="1"
                  max="10"
                  placeholder="Opzionale"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="mav" 
                    checked={mav} 
                    onCheckedChange={(checked) => setMav(checked === true)} 
                  />
                  <Label htmlFor="mav" className="text-gray-700 dark:text-gray-300">MAV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="warmup" 
                    checked={warmup} 
                    onCheckedChange={(checked) => setWarmup(checked === true)} 
                  />
                  <Label htmlFor="warmup" className="text-gray-700 dark:text-gray-300">Riscaldamento</Label>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Note (opzionale)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Aggiungi note per questo esercizio..."
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              rows={2}
            />
          </div>

          <Button
            onClick={handleAddExercise}
            disabled={!selectedExercise || !routineId || addExerciseMutation.isPending}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {addExerciseMutation.isPending ? "Aggiungendo..." : "Aggiungi Esercizio"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

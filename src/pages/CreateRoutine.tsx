import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, X, Trash2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCreateRoutine, useRoutine, useUpdateRoutine } from "@/hooks/useSupabaseQuery";
import { ExerciseBuilderDialog } from "@/components/ExerciseBuilderDialog";
import { CreateExerciseDialog } from "@/components/CreateExerciseDialog";

const CreateRoutine = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryEditId = searchParams.get("edit");
  const id = paramId || queryEditId;
  const isEdit = !!id;
  
  const { data: existingRoutine } = useRoutine(id || "");
  const createRoutineMutation = useCreateRoutine();
  const updateRoutineMutation = useUpdateRoutine();
  
  const [routineName, setRoutineName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [customType, setCustomType] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [editExercise, setEditExercise] = useState<any | null>(null);

  useEffect(() => {
    if (existingRoutine) {
      setRoutineName(existingRoutine.name || "");
      setSelectedType(existingRoutine.type || "");
      setSelectedDays(existingRoutine.assigned_days || []);
      setExercises(existingRoutine.routine_exercises || []);
    }
  }, [existingRoutine]);

  const predefinedTypes = [
    "Braccia", "Gambe", "Petto", "Schiena", "Push", "Pull", 
    "Cardio", "Full Body", "Core", "Spalle"
  ];

  const daysOfWeek = [
    "Lunedì", "Martedì", "Mercoledì", "Giovedì", 
    "Venerdì", "Sabato", "Domenica"
  ];

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setCustomType("");
  };

  const handleCustomTypeChange = (value: string) => {
    setCustomType(value);
    setSelectedType("");
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleExerciseAdded = () => {
    // Refresh exercises list if editing
    if (isEdit && existingRoutine) {
      setExercises(existingRoutine.routine_exercises || []);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const calculateVolume = (exerciseList: any[]) => {
    return exerciseList.reduce((total, ex) => {
      if (ex.weight && ex.sets && ex.reps) {
        return total + (ex.weight * ex.sets * ex.reps);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async () => {
    const isAssigned = selectedDays.length > 0;
    const routineData = {
      name: routineName,
      type: selectedType || customType,
      assigned_days: selectedDays,
      is_assigned: isAssigned,
      calculated_volume: calculateVolume(exercises)
    };

    if (isEdit) {
      await updateRoutineMutation.mutateAsync({ id: id!, ...routineData });
    } else {
      await createRoutineMutation.mutateAsync(routineData);
    }
    navigate("/routines");
  };

  const getExerciseDisplayInfo = (exercise: any) => {
    const trackingType = exercise.tracking_type || 'sets_reps';
    let info = `${exercise.sets} set`;
    
    if (trackingType === 'sets_reps') {
      info += ` × ${exercise.reps || 0} rip`;
      if (exercise.weight && exercise.weight > 0) {
        info += ` - ${exercise.weight}${exercise.weight_unit || 'kg'}`;
      }
    } else if (trackingType === 'duration') {
      const unit = exercise.duration_unit === 'minutes' ? 'min' : 's';
      info += ` × ${exercise.duration || 0}${unit}`;
    } else if (trackingType === 'distance_duration') {
      const durationUnit = exercise.duration_unit === 'minutes' ? 'min' : 's';
      info += ` × ${exercise.duration || 0}${durationUnit}`;
      if (exercise.distance && exercise.distance > 0) {
        info += ` - ${exercise.distance}${exercise.distance_unit || 'm'}`;
      }
    }
    
    return info;
  };

  // Componente riutilizzabile per la lista esercizi di una routine
  function RoutineExercisesList({
    exercises,
    isEdit,
    onEdit,
    onRemove,
    onAdd,
  }: {
    exercises: any[];
    isEdit: boolean;
    onEdit: (exercise: any) => void;
    onRemove: (id: string) => void;
    onAdd: () => void;
  }) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" onClick={onAdd} className="border-gray-300 text-gray-700 hover:border-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Aggiungi esercizio
          </Button>
        </div>
        {exercises.length === 0 && (
          <div className="text-center py-8 text-gray-500">Nessun esercizio nella routine</div>
        )}
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{exercise.exercise?.name || 'Esercizio'}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  {exercise.sets && <span>{exercise.sets} set</span>}
                  {exercise.reps && <span> × {exercise.reps} rip</span>}
                  {exercise.weight > 0 && <span> - {exercise.weight}{exercise.weight_unit || 'kg'}</span>}
                  {exercise.duration > 0 && <span> - {exercise.duration}{exercise.duration_unit === 'minutes' ? 'min' : 's'}</span>}
                  {exercise.distance > 0 && <span> - {exercise.distance}{exercise.distance_unit || 'm'}</span>}
                </div>
                {(exercise.rpe || exercise.mav || exercise.warmup) && (
                  <div className="flex gap-2 mt-2">
                    {exercise.rpe && <Badge variant="secondary" className="text-xs">RPE {exercise.rpe}</Badge>}
                    {exercise.mav && <Badge variant="secondary" className="text-xs">MAV</Badge>}
                    {exercise.warmup && <Badge variant="secondary" className="text-xs">Riscaldamento</Badge>}
                  </div>
                )}
              </div>
              {isEdit && (
                <div className="flex flex-col gap-1 items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(exercise)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Modifica esercizio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 14.362-14.3z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(exercise.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Elimina esercizio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/routines")}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Modifica Routine" : "Crea Nuova Routine"}
            </h1>
            <p className="text-gray-600 mt-1">Configura la tua routine di allenamento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Routine Name */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Nome della Routine</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="routineName" className="text-gray-700">
                  Inserisci un nome per la tua routine
                </Label>
                <Input
                  id="routineName"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  placeholder="es. Upper Body Power"
                  className="mt-2 bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                />
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Tipo di Routine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label className="text-gray-700">
                  Scegli un tipo predefinito o creane uno personalizzato
                </Label>
                
                <div className="flex flex-wrap gap-2">
                  {predefinedTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedType === type 
                          ? "bg-gray-900 text-white hover:bg-gray-800" 
                          : "border-gray-400 text-gray-700 hover:border-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4">
                  <Label htmlFor="customType" className="text-gray-700">
                    Oppure crea un tipo personalizzato
                  </Label>
                  <Input
                    id="customType"
                    value={customType}
                    onChange={(e) => handleCustomTypeChange(e.target.value)}
                    placeholder="Inserisci tipo personalizzato"
                    className="mt-2 bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Giorni Assegnati</CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-gray-700 mb-4 block">
                  Seleziona i giorni in cui questa routine sarà attiva
                </Label>
                
                <div className="grid grid-cols-2 gap-3">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleDayToggle(day)}
                    >
                      <Checkbox
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                        className="border-gray-400"
                      />
                      <Label className="text-gray-700 cursor-pointer">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>

                {selectedDays.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-gray-700 mb-2 block">Giorni Selezionati:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedDays.map((day) => (
                        <Badge
                          key={day}
                          variant="default"
                          className="bg-gray-900 text-white"
                        >
                          {day}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDayToggle(day);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Exercises */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center justify-between">
                  Esercizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RoutineExercisesList
                  exercises={exercises}
                  isEdit={isEdit}
                  onEdit={setEditExercise}
                  onRemove={removeExercise}
                  onAdd={() => setEditExercise(null)}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog per edit/aggiunta esercizio */}
        {(editExercise !== undefined) && (
          <ExerciseBuilderDialog
            routineId={isEdit ? id : undefined}
            existingExercises={editExercise ? exercises.filter(e => e.id !== editExercise.id) : exercises}
            {...(editExercise
              ? {
                  initialExercise: editExercise,
                  onExerciseAdded: () => {
                    setEditExercise(undefined);
                    handleExerciseAdded();
                  },
                  onExerciseSelected: (updated) => {
                    setExercises(prev => prev.map(e => e.id === editExercise.id ? { ...e, ...updated } : e));
                    setEditExercise(undefined);
                  }
                }
              : {
                  onExerciseAdded: handleExerciseAdded,
                  onExerciseSelected: (exercise) => {
                    setExercises(prev => [...prev, { ...exercise, id: Math.random().toString(36).substr(2, 9) }]);
                    setEditExercise(undefined);
                  }
                })}
          />
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/routines")}
            className="flex-1 border-gray-300 text-gray-700 hover:border-gray-400"
          >
            Annulla
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!routineName || (!selectedType && !customType) || createRoutineMutation.isPending || updateRoutineMutation.isPending}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold disabled:opacity-50"
          >
            {createRoutineMutation.isPending || updateRoutineMutation.isPending ? (
              "Salvando..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {isEdit ? "Salva Modifiche" : "Crea Routine"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;

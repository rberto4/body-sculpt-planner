import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Dumbbell } from "lucide-react";
import { useCreateExercise } from "@/hooks/useSupabaseQuery";

interface CreateExerciseDialogProps {
  onExerciseCreated?: (exercise: any) => void;
  trigger?: "button" | "icon";
}

export const CreateExerciseDialog = ({ onExerciseCreated, trigger = "button" }: CreateExerciseDialogProps) => {
  const createExerciseMutation = useCreateExercise();
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const muscleGroups = [
    "Petto", "Schiena", "Spalle", "Bicipiti", "Tricipiti", 
    "Gambe", "Quadricipiti", "Femorali", "Glutei", "Polpacci", "Core", "Totalbody"
  ];

  const exerciseTypes = [
    "Forza", "Cardio", "Flessibilità", "Funzionale", "Isometrico"
  ];

  const handleCreateExercise = async () => {
    if (!name || !muscleGroup || !type) return;

    try {
      const newExercise = await createExerciseMutation.mutateAsync({
        name,
        muscle_group: muscleGroup,
        type,
        description
      });
      
      // Reset form
      setName("");
      setMuscleGroup("");
      setType("");
      setDescription("");
      setOpen(false);
      
      onExerciseCreated?.(newExercise);
    } catch (error) {
      console.error("Error creating exercise:", error);
    }
  };

  const handleTypeChange = (val: string) => {
    setType(val);
    if (val === "Cardio") {
      setMuscleGroup("Totalbody");
    }
  };

  const TriggerComponent = trigger === "icon" ? (
    <Button variant="outline" size="sm" className="w-8 h-8 p-0">
      <Dumbbell className="w-3 h-3" />
    </Button>
  ) : (
    <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-gray-400">
      <Plus className="w-4 h-4 mr-2" />
      + Nuovo esercizio
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {TriggerComponent}
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="font-outfit">Crea Nuovo Esercizio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Nome Esercizio</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. Panca Piana"
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Gruppo Muscolare</Label>
            <Select value={muscleGroup} onValueChange={setMuscleGroup} disabled={type === "Cardio"}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Seleziona gruppo muscolare..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Tipo di Esercizio</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Seleziona tipo..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                {exerciseTypes.map((exerciseType) => (
                  <SelectItem key={exerciseType} value={exerciseType} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    {exerciseType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Descrizione (opzionale)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi l'esercizio..."
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              rows={3}
            />
          </div>

          <Button
            onClick={handleCreateExercise}
            disabled={!name || !muscleGroup || !type || createExerciseMutation.isPending}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {createExerciseMutation.isPending ? "Creando..." : "Crea Esercizio"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

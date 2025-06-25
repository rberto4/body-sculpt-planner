
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Plus, User, Zap, Activity, Target, Shield, Dumbbell } from "lucide-react";
import { useExercises, useCreateExercise } from "@/hooks/useSupabaseQuery";

const Exercises = () => {
  const { data: exercises = [], isLoading } = useExercises();
  const createExerciseMutation = useCreateExercise();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New exercise form state
  const [newExercise, setNewExercise] = useState({
    name: "",
    muscle_group: "",
    type: "",
    description: ""
  });

  const muscleGroups = ["Chest", "Back", "Legs", "Core", "Arms", "Shoulders", "Triceps", "Biceps", "Glutes", "Calfs", "Hamstrings"];
  const types = ["Push", "Pull", "Legs", "Core", "Full Body", "Cardio"];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === "all" || exercise.muscle_group === selectedMuscleGroup;
    const matchesType = selectedType === "all" || exercise.type === selectedType;
    return matchesSearch && matchesMuscleGroup && matchesType;
  });

  const handleCreateExercise = async () => {
    if (!newExercise.name || !newExercise.muscle_group || !newExercise.type) return;

    try {
      await createExerciseMutation.mutateAsync(newExercise);
      setNewExercise({ name: "", muscle_group: "", type: "", description: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating exercise:", error);
    }
  };

  const getMuscleGroupIcon = (muscleGroup: string) => {
    const iconMap: { [key: string]: any } = {
      'Chest': User,
      'Back': Shield,
      'Legs': Activity,
      'Core': Target,
      'Shoulders': Dumbbell,
      'Triceps': Zap,
      'Biceps': Zap,
      'Glutes': Activity,
      'Calfs': Activity,
      'Hamstrings': Activity
    };
    return iconMap[muscleGroup] || Target;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600">Caricamento esercizi...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Libreria Esercizi
            </h1>
            <p className="text-gray-600">Gestisci il tuo database di esercizi</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Esercizio
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900">
              <DialogHeader>
                <DialogTitle className="text-gray-900 font-outfit">Crea Nuovo Esercizio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Nome Esercizio</Label>
                  <Input
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="es. Push-up"
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-700">Gruppo Muscolare</Label>
                  <Select 
                    value={newExercise.muscle_group} 
                    onValueChange={(value) => setNewExercise(prev => ({ ...prev, muscle_group: value }))}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                      <SelectValue placeholder="Seleziona gruppo muscolare" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {muscleGroups.map(group => (
                        <SelectItem key={group} value={group} className="text-gray-900">{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700">Tipo</Label>
                  <Select 
                    value={newExercise.type} 
                    onValueChange={(value) => setNewExercise(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {types.map(type => (
                        <SelectItem key={type} value={type} className="text-gray-900">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700">Descrizione</Label>
                  <Textarea
                    value={newExercise.description}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrizione dell'esercizio..."
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>

                <Button
                  onClick={handleCreateExercise}
                  disabled={!newExercise.name || !newExercise.muscle_group || !newExercise.type || createExerciseMutation.isPending}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {createExerciseMutation.isPending ? "Creando..." : "Crea Esercizio"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gray-50 border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca esercizi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Muscle Group Filter */}
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Tutti i gruppi muscolari" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all" className="text-gray-900">Tutti i gruppi muscolari</SelectItem>
                  {muscleGroups.map(group => (
                    <SelectItem key={group} value={group} className="text-gray-900">{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Tutti i tipi" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all" className="text-gray-900">Tutti i tipi</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type} className="text-gray-900">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => {
            const IconComponent = getMuscleGroupIcon(exercise.muscle_group);
            
            return (
              <Card 
                key={exercise.id}
                className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 cursor-pointer group shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-800 p-2 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-900 text-lg group-hover:text-gray-700 transition-colors">
                          {exercise.name}
                        </CardTitle>
                        <div className="text-sm text-gray-500">{exercise.muscle_group}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 h-auto ${exercise.is_favorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-400`}
                    >
                      <Heart className={`w-4 h-4 ${exercise.is_favorite ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {exercise.description && (
                    <p className="text-gray-600 text-sm">{exercise.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      {exercise.muscle_group}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {exercise.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nessun esercizio trovato</h3>
              <p>Prova ad aggiustare i filtri di ricerca</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;

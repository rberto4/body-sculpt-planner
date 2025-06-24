
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Plus } from "lucide-react";
import { useExercises, useCreateExercise } from "@/hooks/useSupabaseQuery";

const Exercises = () => {
  const { data: exercises = [], isLoading } = useExercises();
  const createExerciseMutation = useCreateExercise();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [selectedType, setSelectedType] = useState("");
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
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscle_group === selectedMuscleGroup;
    const matchesType = !selectedType || exercise.type === selectedType;
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

  const getMuscleGroupImage = (muscleGroup: string) => {
    const imageMap: { [key: string]: string } = {
      'Chest': '/src/assets/muscle_images/chest.png',
      'Back': '/src/assets/muscle_images/back.png',
      'Legs': '/src/assets/muscle_images/legs.png',
      'Core': '/src/assets/muscle_images/core.png',
      'Shoulders': '/src/assets/muscle_images/shoulders.png',
      'Triceps': '/src/assets/muscle_images/triceps.png',
      'Biceps': '/src/assets/muscle_images/biceps.png',
      'Glutes': '/src/assets/muscle_images/glutes.png',
      'Calfs': '/src/assets/muscle_images/calfs.png',
      'Hamstrings': '/src/assets/muscle_images/hamstrings.png'
    };
    return imageMap[muscleGroup] || '/src/assets/muscle_images/core.png';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-slate-300">Caricamento esercizi...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 font-outfit">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Libreria Esercizi
            </h1>
            <p className="text-slate-300">Gestisci il tuo database di esercizi</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Esercizio
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-600 text-white">
              <DialogHeader>
                <DialogTitle className="text-white font-outfit">Crea Nuovo Esercizio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Nome Esercizio</Label>
                  <Input
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="es. Push-up"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Gruppo Muscolare</Label>
                  <Select 
                    value={newExercise.muscle_group} 
                    onValueChange={(value) => setNewExercise(prev => ({ ...prev, muscle_group: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Seleziona gruppo muscolare" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {muscleGroups.map(group => (
                        <SelectItem key={group} value={group} className="text-white">{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Tipo</Label>
                  <Select 
                    value={newExercise.type} 
                    onValueChange={(value) => setNewExercise(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {types.map(type => (
                        <SelectItem key={type} value={type} className="text-white">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Descrizione</Label>
                  <Textarea
                    value={newExercise.description}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrizione dell'esercizio..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button
                  onClick={handleCreateExercise}
                  disabled={!newExercise.name || !newExercise.muscle_group || !newExercise.type || createExerciseMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                >
                  {createExerciseMutation.isPending ? "Creando..." : "Crea Esercizio"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Cerca esercizi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Muscle Group Filter */}
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Tutti i gruppi muscolari" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="" className="text-white">Tutti i gruppi muscolari</SelectItem>
                  {muscleGroups.map(group => (
                    <SelectItem key={group} value={group} className="text-white">{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Tutti i tipi" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="" className="text-white">Tutti i tipi</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type} className="text-white">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id}
              className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2 flex items-center justify-center">
                      <img 
                        src={getMuscleGroupImage(exercise.muscle_group)} 
                        alt={exercise.muscle_group}
                        className="w-full h-full object-contain filter brightness-0 invert"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors">
                        {exercise.name}
                      </CardTitle>
                      <div className="text-sm text-slate-400">{exercise.muscle_group}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-auto ${exercise.is_favorite ? 'text-red-400' : 'text-slate-400'} hover:text-red-300`}
                  >
                    <Heart className={`w-4 h-4 ${exercise.is_favorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {exercise.description && (
                  <p className="text-slate-300 text-sm">{exercise.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                    {exercise.muscle_group}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {exercise.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
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

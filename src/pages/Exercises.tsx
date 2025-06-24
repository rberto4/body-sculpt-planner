
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Filter, Plus } from "lucide-react";

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [exercises] = useState([
    {
      id: 1,
      name: "Push-ups",
      muscleGroup: "Chest",
      type: "Push",
      isFavorite: true,
      description: "Classic bodyweight chest exercise"
    },
    {
      id: 2,
      name: "Pull-ups",
      muscleGroup: "Back",
      type: "Pull",
      isFavorite: false,
      description: "Upper body pulling exercise"
    },
    {
      id: 3,
      name: "Squats",
      muscleGroup: "Legs",
      type: "Legs",
      isFavorite: true,
      description: "Fundamental lower body exercise"
    },
    {
      id: 4,
      name: "Plank",
      muscleGroup: "Core",
      type: "Core",
      isFavorite: false,
      description: "Isometric core strengthening exercise"
    }
  ]);

  const muscleGroups = ["Chest", "Back", "Legs", "Core", "Arms", "Shoulders"];
  const types = ["Push", "Pull", "Legs", "Core", "Full Body", "Cardio"];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscleGroup === selectedMuscleGroup;
    const matchesType = !selectedType || exercise.type === selectedType;
    return matchesSearch && matchesMuscleGroup && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-lime-400 mb-2">Exercise Library</h1>
            <p className="text-gray-300">Manage your exercise database</p>
          </div>
          <Button className="bg-lime-500 hover:bg-lime-400 text-black font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Muscle Group Filter */}
            <div>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">All Muscle Groups</option>
                {muscleGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lime-400 text-lg group-hover:text-lime-300 transition-colors">
                    {exercise.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-auto ${exercise.isFavorite ? 'text-red-400' : 'text-gray-400'} hover:text-red-300`}
                  >
                    <Heart className={`w-4 h-4 ${exercise.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">{exercise.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-lime-500/30 text-lime-400">
                    {exercise.muscleGroup}
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
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
            <div className="text-gray-400 mb-4">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No exercises found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;

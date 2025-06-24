
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoutines } from "@/hooks/useSupabaseQuery";

const Routines = () => {
  const navigate = useNavigate();
  const { data: routines = [], isLoading } = useRoutines();

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getEstimatedTime = (routine: any) => {
    if (!routine.routine_exercises?.length) return 30;
    const totalTime = routine.routine_exercises.reduce((acc: number, re: any) => {
      const exerciseTime = re.duration || (re.sets * (re.reps || 10) * 2); // 2 secondi per rep
      const restTime = re.rest_time || 60;
      return acc + exerciseTime + restTime;
    }, 0);
    return Math.round(totalTime / 60); // Converti in minuti
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-lime-400 text-xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Caricamento routine...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-lime-400 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Le Tue Routine
            </h1>
            <p className="text-gray-300">Gestisci i tuoi programmi di allenamento</p>
          </div>
          <Button 
            onClick={() => navigate("/routines/create")}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crea Routine
          </Button>
        </div>

        {/* Routines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine: any) => (
            <Card 
              key={routine.id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/routines/${routine.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lime-400 text-lg group-hover:text-lime-300 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {routine.name}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/routines/${routine.id}/edit`);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement delete functionality
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit border-lime-500/30 text-lime-400">
                  {routine.type}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Assignment Status */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${routine.is_assigned ? 'bg-lime-500' : 'bg-gray-500'}`} />
                  <span className="text-sm text-gray-300">
                    {routine.is_assigned ? 'Assegnata' : 'Non Assegnata'}
                  </span>
                </div>

                {/* Assigned Days */}
                {routine.assigned_days?.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {routine.assigned_days.map((day: string) => (
                        <Badge key={day} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercise Count & Time */}
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <span>{routine.routine_exercises?.length || 0} esercizi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{getEstimatedTime(routine)}min</span>
                  </div>
                </div>

                {/* Volume Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Volume di Allenamento</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getVolumeColor(routine.volume)}`} />
                    <span className="text-sm text-gray-300">{routine.volume}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {routines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Edit className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Nessuna routine ancora
              </h3>
              <p>Crea la tua prima routine di allenamento per iniziare</p>
            </div>
            <Button 
              onClick={() => navigate("/routines/create")}
              className="bg-lime-500 hover:bg-lime-400 text-black font-semibold mt-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crea la Tua Prima Routine
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Routines;

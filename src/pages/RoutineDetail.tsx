
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Edit, Calendar, Clock, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const RoutineDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Sample routine data - in real app this would come from an API
  const routine = {
    id: parseInt(id || "1"),
    name: "Upper Body Power",
    type: "Push",
    assignedDays: ["Monday", "Thursday"],
    exerciseCount: 6,
    estimatedTime: 45,
    isAssigned: true,
    volume: "High",
    exercises: [
      {
        id: 1,
        name: "Push-ups",
        sets: 3,
        reps: 12,
        restTime: 60,
        notes: "Focus on controlled movement",
        tracking: "sets_reps"
      },
      {
        id: 2,
        name: "Pike Push-ups", 
        sets: 3,
        reps: 8,
        restTime: 90,
        notes: "Target shoulders",
        tracking: "sets_reps"
      },
      {
        id: 3,
        name: "Diamond Push-ups",
        sets: 2,
        reps: 6,
        restTime: 60,
        notes: "Tricep focus",
        tracking: "sets_reps"
      },
      {
        id: 4,
        name: "Plank Hold",
        duration: 30,
        sets: 3,
        restTime: 45,
        notes: "Maintain straight line",
        tracking: "duration"
      }
    ]
  };

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const startWorkout = () => {
    navigate("/training");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/routines")}
            className="mr-4 text-gray-300 hover:text-lime-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Routines
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-lime-400">{routine.name}</h1>
            <p className="text-gray-300 mt-1">Routine details and exercises</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:border-lime-400 hover:text-lime-400"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              onClick={startWorkout}
              className="bg-lime-500 hover:bg-lime-400 text-black font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Routine Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lime-400">Routine Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type</span>
                  <Badge variant="outline" className="border-lime-500/30 text-lime-400">
                    {routine.type}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${routine.isAssigned ? 'bg-lime-500' : 'bg-gray-500'}`} />
                    <span className="text-gray-300">
                      {routine.isAssigned ? 'Assigned' : 'Not Assigned'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Volume</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getVolumeColor(routine.volume)}`} />
                    <span className="text-gray-300">{routine.volume}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Exercises</span>
                  <span className="text-gray-300">{routine.exerciseCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Est. Time</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">{routine.estimatedTime}min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Days */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lime-400">Assigned Days</CardTitle>
              </CardHeader>
              <CardContent>
                {routine.assignedDays.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {routine.assignedDays.map((day) => (
                      <Badge key={day} variant="default" className="bg-lime-500 text-black">
                        {day}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No days assigned</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Exercise List */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lime-400">Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routine.exercises.map((exercise, index) => (
                    <div 
                      key={exercise.id}
                      className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lime-400">{exercise.name}</h3>
                          <div className="text-sm text-gray-400 mt-1">
                            Exercise {index + 1}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                          {exercise.tracking === "sets_reps" ? "Sets & Reps" : "Duration"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        {exercise.tracking === "sets_reps" ? (
                          <>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Sets</div>
                              <div className="font-semibold text-white">{exercise.sets}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Reps</div>
                              <div className="font-semibold text-white">{exercise.reps}</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Sets</div>
                              <div className="font-semibold text-white">{exercise.sets}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Duration</div>
                              <div className="font-semibold text-white">{exercise.duration}s</div>
                            </div>
                          </>
                        )}
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Rest</div>
                          <div className="font-semibold text-white">{exercise.restTime}s</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Total Time</div>
                          <div className="font-semibold text-white">
                            {Math.round((exercise.sets * (exercise.restTime || 60)) / 60)}min
                          </div>
                        </div>
                      </div>

                      {exercise.notes && (
                        <div className="text-sm text-gray-400 italic">
                          📝 {exercise.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;

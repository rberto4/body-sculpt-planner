
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, Clock, CheckCircle, XCircle } from "lucide-react";

const Training = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  // Sample workout data
  const currentWorkout = {
    name: "Upper Body Power",
    exercises: [
      {
        id: 1,
        name: "Push-ups",
        sets: 3,
        reps: 12,
        restTime: 60,
        completed: false,
        skipped: false
      },
      {
        id: 2,
        name: "Pike Push-ups",
        sets: 3,
        reps: 8,
        restTime: 90,
        completed: false,
        skipped: false
      },
      {
        id: 3,
        name: "Diamond Push-ups",
        sets: 2,
        reps: 6,
        restTime: 60,
        completed: false,
        skipped: false
      }
    ]
  };

  const [exercises, setExercises] = useState(currentWorkout.exercises);

  const currentExercise = exercises[currentExerciseIndex];
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const progress = (completedExercises / exercises.length) * 100;

  const startWorkout = () => {
    setIsTraining(true);
  };

  const completeSet = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTime(currentExercise.restTime);
    } else {
      // Exercise completed
      const updatedExercises = [...exercises];
      updatedExercises[currentExerciseIndex].completed = true;
      setExercises(updatedExercises);
      
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        // Workout completed
        setIsTraining(false);
      }
    }
  };

  const skipSet = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      const updatedExercises = [...exercises];
      updatedExercises[currentExerciseIndex].skipped = true;
      setExercises(updatedExercises);
      
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        setIsTraining(false);
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const addRestTime = () => {
    setRestTime(prev => prev + 30);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-lime-400 mb-2">Active Training</h1>
          <p className="text-gray-300">Start and track your workout session</p>
        </div>

        {!isTraining ? (
          /* Pre-workout screen */
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400 text-center">
                {currentWorkout.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300 mb-2">
                  {exercises.length} Exercises
                </div>
                <p className="text-gray-400">Ready to start your workout?</p>
              </div>

              <div className="space-y-3">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-300">{exercise.name}</span>
                      <div className="text-sm text-gray-400">
                        {exercise.sets} sets × {exercise.reps} reps
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-500 text-gray-400">
                      {exercise.restTime}s rest
                    </Badge>
                  </div>
                ))}
              </div>

              <Button 
                onClick={startWorkout}
                className="w-full bg-lime-500 hover:bg-lime-400 text-black font-semibold py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Active workout screen */
          <div className="space-y-6">
            {/* Progress */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Workout Progress</span>
                  <span className="text-sm text-gray-400">
                    {completedExercises}/{exercises.length} exercises
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {isResting ? (
              /* Rest screen */
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <Clock className="w-16 h-16 mx-auto text-lime-400 mb-4" />
                    <h2 className="text-2xl font-bold text-lime-400 mb-2">Rest Time</h2>
                    <div className="text-4xl font-bold text-white mb-4">
                      {Math.floor(restTime / 60)}:{(restTime % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={skipRest}
                      className="w-full bg-lime-500 hover:bg-lime-400 text-black font-semibold"
                    >
                      Skip Rest
                    </Button>
                    <Button 
                      onClick={addRestTime}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300"
                    >
                      Add 30s
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Exercise screen */
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lime-400 text-center">
                    {currentExercise.name}
                  </CardTitle>
                  <div className="text-center text-gray-400">
                    Exercise {currentExerciseIndex + 1} of {exercises.length}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      Set {currentSet} / {currentExercise.sets}
                    </div>
                    <div className="text-xl text-gray-300">
                      {currentExercise.reps} reps
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={completeSet}
                      className="bg-lime-500 hover:bg-lime-400 text-black font-semibold py-3"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Complete Set
                    </Button>
                    <Button 
                      onClick={skipSet}
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 py-3"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Skip Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exercise List */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lime-400">Exercise List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <div 
                      key={exercise.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === currentExerciseIndex 
                          ? 'bg-lime-500/20 border border-lime-500/50' 
                          : exercise.completed 
                          ? 'bg-green-500/20 border border-green-500/50' 
                          : exercise.skipped
                          ? 'bg-red-500/20 border border-red-500/50'
                          : 'bg-gray-700/50'
                      }`}
                    >
                      <span className="font-semibold text-gray-300">{exercise.name}</span>
                      <div className="flex items-center space-x-2">
                        {exercise.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {exercise.skipped && <XCircle className="w-4 h-4 text-red-400" />}
                        {index === currentExerciseIndex && <Play className="w-4 h-4 text-lime-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;

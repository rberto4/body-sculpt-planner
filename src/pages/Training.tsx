
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/Timer";
import { Play, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCreateWorkout } from "@/hooks/useSupabaseQuery";

const Training = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const createWorkoutMutation = useCreateWorkout();
  
  const [isTraining, setIsTraining] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<any[]>([]);

  // Get routine from navigation state or use sample data
  const routineFromState = location.state?.routine;
  
  const sampleWorkout = {
    id: "sample",
    name: "Upper Body Power",
    routine_exercises: [
      {
        id: "1",
        sets: 3,
        reps: 12,
        rest_time: 60,
        tracking_type: "sets_reps",
        exercise: { id: "1", name: "Push-ups", muscle_group: "Chest" }
      },
      {
        id: "2", 
        sets: 3,
        reps: 8,
        rest_time: 90,
        tracking_type: "sets_reps",
        exercise: { id: "2", name: "Pike Push-ups", muscle_group: "Shoulders" }
      },
      {
        id: "3",
        sets: 2,
        reps: 6,
        rest_time: 60,
        tracking_type: "sets_reps",
        exercise: { id: "3", name: "Diamond Push-ups", muscle_group: "Triceps" }
      }
    ]
  };

  const currentWorkout = routineFromState || sampleWorkout;
  const exercises = currentWorkout.routine_exercises || [];
  
  const [exerciseStates, setExerciseStates] = useState(
    exercises.map(() => ({
      completed: false,
      skipped: false,
      setsCompleted: 0,
      repsCompleted: [] as number[],
      notes: ""
    }))
  );

  const currentExercise = exercises[currentExerciseIndex];
  const progress = (exerciseStates.filter(ex => ex.completed || ex.skipped).length / exercises.length) * 100;

  const startWorkout = () => {
    setIsTraining(true);
  };

  const completeSet = () => {
    const newStates = [...exerciseStates];
    newStates[currentExerciseIndex].setsCompleted++;
    newStates[currentExerciseIndex].repsCompleted.push(currentExercise.reps || 0);
    setExerciseStates(newStates);

    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTime(currentExercise.rest_time || 60);
    } else {
      // Exercise completed
      const updatedStates = [...exerciseStates];
      updatedStates[currentExerciseIndex].completed = true;
      setExerciseStates(updatedStates);
      
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        // Workout completed
        completeWorkout();
      }
    }
  };

  const skipSet = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      const updatedStates = [...exerciseStates];
      updatedStates[currentExerciseIndex].skipped = true;
      setExerciseStates(updatedStates);
      
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        completeWorkout();
      }
    }
  };

  const completeWorkout = async () => {
    const workoutData = {
      routineId: currentWorkout.id,
      exercises: exercises.map((exercise, index) => ({
        exercise_id: exercise.exercise.id,
        routine_exercise_id: exercise.id,
        sets_completed: exerciseStates[index].setsCompleted,
        reps_completed: exerciseStates[index].repsCompleted,
        weight_used: [],
        duration_completed: null,
        is_completed: exerciseStates[index].completed,
        is_skipped: exerciseStates[index].skipped,
        notes: exerciseStates[index].notes
      }))
    };

    try {
      await createWorkoutMutation.mutateAsync(workoutData);
      setIsTraining(false);
      navigate("/progress");
    } catch (error) {
      console.error("Error saving workout:", error);
      setIsTraining(false);
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const handleAddRestTime = () => {
    setRestTime(prev => prev + 30);
  };

  if (!currentWorkout || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 font-outfit">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Nessun Allenamento</h1>
            <p className="text-slate-300 mb-6">Seleziona una routine per iniziare l'allenamento.</p>
            <Button 
              onClick={() => navigate("/routines")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
            >
              Vai alle Routine
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 font-outfit">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4 text-white hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Allenamento Attivo</h1>
            <p className="text-slate-300">Traccia la tua sessione di allenamento</p>
          </div>
        </div>

        {!isTraining ? (
          /* Pre-workout screen */
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center font-outfit">
                {currentWorkout.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {exercises.length} Esercizi
                </div>
                <p className="text-slate-300">Pronto per iniziare il tuo allenamento?</p>
              </div>

              <div className="space-y-3">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div>
                      <span className="font-semibold text-white">{exercise.exercise.name}</span>
                      <div className="text-sm text-slate-300">
                        {exercise.sets} set × {exercise.reps} rip
                      </div>
                    </div>
                    <Badge variant="outline" className="border-white/30 text-slate-300">
                      {exercise.rest_time}s riposo
                    </Badge>
                  </div>
                ))}
              </div>

              <Button 
                onClick={startWorkout}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Inizia Allenamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Active workout screen */
          <div className="space-y-6">
            {/* Progress */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Progresso Allenamento</span>
                  <span className="text-sm text-slate-300">
                    {exerciseStates.filter(ex => ex.completed || ex.skipped).length}/{exercises.length} esercizi
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {isResting ? (
              <Timer
                initialTime={restTime}
                onComplete={handleRestComplete}
                onSkip={handleSkipRest}
                onAddTime={handleAddRestTime}
                isActive={true}
              />
            ) : (
              /* Exercise screen */
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-center font-outfit">
                    {currentExercise.exercise.name}
                  </CardTitle>
                  <div className="text-center text-slate-300">
                    Esercizio {currentExerciseIndex + 1} di {exercises.length}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      Set {currentSet} / {currentExercise.sets}
                    </div>
                    <div className="text-xl text-slate-300">
                      {currentExercise.reps} ripetizioni
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={completeSet}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold py-3"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Completa Set
                    </Button>
                    <Button 
                      onClick={skipSet}
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 py-3"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Salta Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exercise List */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-outfit">Lista Esercizi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <div 
                      key={exercise.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === currentExerciseIndex 
                          ? 'bg-blue-500/20 border border-blue-500/50' 
                          : exerciseStates[index].completed 
                          ? 'bg-emerald-500/20 border border-emerald-500/50' 
                          : exerciseStates[index].skipped
                          ? 'bg-red-500/20 border border-red-500/50'
                          : 'bg-white/10'
                      }`}
                    >
                      <span className="font-semibold text-white">{exercise.exercise.name}</span>
                      <div className="flex items-center space-x-2">
                        {exerciseStates[index].completed && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {exerciseStates[index].skipped && <XCircle className="w-4 h-4 text-red-400" />}
                        {index === currentExerciseIndex && <Play className="w-4 h-4 text-blue-400" />}
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

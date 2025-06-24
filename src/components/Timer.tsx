
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Pause, RotateCcw, Plus } from "lucide-react";

interface TimerProps {
  initialTime: number;
  onComplete: () => void;
  onSkip: () => void;
  onAddTime: () => void;
  isActive: boolean;
}

export const Timer = ({ initialTime, onComplete, onSkip, onAddTime, isActive }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(isActive);
  }, [initialTime, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  const addTime = () => {
    setTimeLeft(prev => prev + 30);
    onAddTime();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardContent className="p-6 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Tempo di Riposo</h2>
          <div className="text-5xl font-bold text-white mb-4 font-outfit">
            {formatTime(timeLeft)}
          </div>
          <Progress 
            value={progress} 
            className="h-2 mb-4"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button 
            onClick={toggleTimer}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Pausa' : 'Avvia'}
          </Button>
          <Button 
            onClick={resetTimer}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={onSkip}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold"
          >
            Salta Riposo
          </Button>
          <Button 
            onClick={addTime}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            +30s
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

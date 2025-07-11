
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, X, Timer as TimerIcon, Pause, SkipForward, Plus, Dumbbell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const FloatingActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    // Check if there's an active workout in localStorage
    const activeWorkout = localStorage.getItem('activeWorkout');
    const restingState = localStorage.getItem('restingState');
    
    setIsTrainingActive(!!activeWorkout);
    
    if (restingState) {
      const restData = JSON.parse(restingState);
      setIsResting(true);
      setRestTime(restData.timeLeft || 0);
      setIsPaused(restData.isPaused || false);
      setShowTimer(location.pathname !== '/training');
    } else {
      setIsResting(false);
      setShowTimer(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isResting || isPaused || restTime <= 0) return;

    const interval = setInterval(() => {
      setRestTime((prev) => {
        const newTime = prev - 1;
        
        // Update localStorage
        if (newTime > 0) {
          localStorage.setItem('restingState', JSON.stringify({
            timeLeft: newTime,
            isPaused: false
          }));
        } else {
          localStorage.removeItem('restingState');
          setIsResting(false);
          setShowTimer(false);
        }
        
        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, isPaused, restTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    localStorage.setItem('restingState', JSON.stringify({
      timeLeft: restTime,
      isPaused: newPausedState
    }));
  };

  const handleSkipRest = () => {
    localStorage.removeItem('restingState');
    setIsResting(false);
    setShowTimer(false);
    setRestTime(0);
    
    if (location.pathname !== '/training') {
      navigate('/training');
    }
  };

  const handleAddTime = () => {
    const newTime = restTime + 30;
    setRestTime(newTime);
    
    localStorage.setItem('restingState', JSON.stringify({
      timeLeft: newTime,
      isPaused: isPaused
    }));
  };

  const handleClick = () => {
    if (location.pathname === '/training') {
      return;
    } else {
      navigate('/training');
    }
  };

  // Don't show FAB on training page or if no active workout
  if (!isTrainingActive || location.pathname === '/training') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Timer Card - shown when resting and not on training page */}
      {isResting && showTimer ? (
        <Card 
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg cursor-pointer"
          onClick={handleClick}
        >
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(restTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Riposo attivo</div>
            </div>
            
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePauseResume();
                }}
                className="w-8 h-8 p-0"
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddTime();
                }}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkipRest();
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 px-3"
              >
                <SkipForward className="w-3 h-3 mr-1" />
                Salta
              </Button>
            </div>
            
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              Tocca per tornare all'allenamento
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Main FAB - only when not resting */
        <Card 
          className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={handleClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Dumbbell className="w-6 h-6 text-white dark:text-gray-900" />
              <div>
                <div className="text-white dark:text-gray-900 font-semibold">Allenamento Attivo</div>
                <div className="text-xs text-gray-300 dark:text-gray-600">Tocca per continuare</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const FloatingActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTrainingActive, setIsTrainingActive] = useState(false);

  useEffect(() => {
    // Check if we're on training page or if there's an active workout in localStorage
    const activeWorkout = localStorage.getItem('activeWorkout');
    setIsTrainingActive(location.pathname === '/training' || !!activeWorkout);
  }, [location.pathname]);

  if (!isTrainingActive) return null;

  const handleClick = () => {
    if (location.pathname === '/training') {
      // If on training page, maybe show a different action
      return;
    } else {
      navigate('/training');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        {location.pathname === '/training' ? (
          <X className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoutines, useWorkouts } from "@/hooks/useSupabaseQuery";

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: routines = [] } = useRoutines();
  const { data: workouts = [] } = useWorkouts();
  
  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getRoutinesForDay = (day: number) => {
    const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const dayName = dayNames[dayOfWeek];
    
    return routines.filter(routine => 
      routine.is_assigned && routine.assigned_days?.includes(dayName)
    );
  };

  const getWorkoutForDay = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workouts.find(workout => 
      workout.completed_at && workout.completed_at.startsWith(dateString)
    );
  };

  const startRoutine = (routine: any) => {
    navigate('/training', { state: { routine } });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 font-outfit">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Calendario Allenamenti
          </h1>
          <p className="text-slate-300">Traccia il tuo programma di allenamento</p>
        </div>

        {/* Calendar */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl font-outfit">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center font-semibold text-slate-300 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-24"></div>;
                }

                const assignedRoutines = getRoutinesForDay(day);
                const completedWorkout = getWorkoutForDay(day);
                const today = new Date();
                const isToday = 
                  currentDate.getFullYear() === today.getFullYear() &&
                  currentDate.getMonth() === today.getMonth() &&
                  day === today.getDate();

                return (
                  <div
                    key={day}
                    className={`h-24 p-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                      isToday ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-400' : 'text-white'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {completedWorkout && (
                        <Badge
                          variant="default"
                          className="text-xs px-1 py-0 h-4 bg-emerald-500 text-black"
                        >
                          ✓ Completato
                        </Badge>
                      )}
                      {assignedRoutines.slice(0, 2).map((routine, idx) => (
                        <div key={idx} className="group">
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0 h-4 border-blue-400/50 text-blue-300 cursor-pointer hover:bg-blue-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRoutine(routine);
                            }}
                          >
                            <Play className="w-2 h-2 mr-1" />
                            {routine.name.slice(0, 8)}...
                          </Badge>
                        </div>
                      ))}
                      {assignedRoutines.length > 2 && (
                        <div className="text-xs text-slate-400">
                          +{assignedRoutines.length - 2} altro/i
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span>Workout Completato</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border border-blue-400 rounded"></div>
            <span>Routine Programmata</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/50 rounded"></div>
            <span>Oggi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

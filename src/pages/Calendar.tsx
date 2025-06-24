
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Sample workout data
  const workoutData = {
    "2024-01-15": [{ name: "Upper Body Power", completed: true }],
    "2024-01-16": [{ name: "Lower Body Strength", completed: false }],
    "2024-01-18": [{ name: "Cardio HIIT", completed: true }],
    "2024-01-20": [{ name: "Upper Body Power", completed: true }],
  };

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

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getWorkoutsForDay = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return workoutData[dateKey] || [];
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lime-400 mb-2">Training Calendar</h1>
          <p className="text-gray-300">Track your workout schedule</p>
        </div>

        {/* Calendar */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lime-400 text-xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="border-gray-600 text-gray-300 hover:border-lime-400 hover:text-lime-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="border-gray-600 text-gray-300 hover:border-lime-400 hover:text-lime-400"
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
                <div key={day} className="text-center font-semibold text-gray-400 py-2">
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

                const workouts = getWorkoutsForDay(day);
                const today = new Date();
                const isToday = 
                  currentDate.getFullYear() === today.getFullYear() &&
                  currentDate.getMonth() === today.getMonth() &&
                  day === today.getDate();

                return (
                  <div
                    key={day}
                    className={`h-24 p-2 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      isToday ? 'bg-lime-500/20 border-lime-500/50' : 'bg-gray-800/30'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-lime-400' : 'text-gray-300'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {workouts.map((workout, idx) => (
                        <Badge
                          key={idx}
                          variant={workout.completed ? "default" : "outline"}
                          className={`text-xs px-1 py-0 h-4 ${
                            workout.completed 
                              ? "bg-lime-500 text-black" 
                              : "border-gray-500 text-gray-400"
                          }`}
                        >
                          {workout.name.slice(0, 8)}...
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-lime-500 rounded"></div>
            <span>Completed Workout</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border border-gray-500 rounded"></div>
            <span>Scheduled Workout</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-lime-500/20 border border-lime-500/50 rounded"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

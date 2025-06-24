
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Timer, Edit, Heart, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoutines, useWorkouts } from "@/hooks/useSupabaseQuery";

const Index = () => {
  const navigate = useNavigate();
  const { data: routines = [] } = useRoutines();
  const { data: workouts = [] } = useWorkouts();

  const completedWorkouts = workouts.filter(w => w.is_completed).length;
  const activeRoutines = routines.filter(r => r.is_assigned).length;

  const features = [
    {
      title: "Routines",
      description: "Crea e gestisci le tue routine di allenamento",
      icon: Edit,
      path: "/routines",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      title: "Esercizi",
      description: "Sfoglia e gestisci il tuo database di esercizi",
      icon: Heart,
      path: "/exercises",
      gradient: "from-gray-700 to-gray-900"
    },
    {
      title: "Calendario",
      description: "Visualizza e traccia il tuo programma di allenamento",
      icon: Calendar,
      path: "/calendar",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      title: "Allenamento Attivo",
      description: "Inizia la tua sessione di allenamento",
      icon: Timer,
      path: "/training",
      gradient: "from-gray-700 to-gray-900"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-outfit">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Bodyweight
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Il tuo compagno completo per gestire routine, tracciare progressi e raggiungere i tuoi obiettivi di fitness
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <Edit className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">Routine Attive</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeRoutines}</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">Workout Completati</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedWorkouts}</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">Totale Routine</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{routines.length}</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-sm"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                >
                  Apri {feature.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

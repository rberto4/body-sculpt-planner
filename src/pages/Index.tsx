
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
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Esercizi",
      description: "Sfoglia e gestisci il tuo database di esercizi",
      icon: Heart,
      path: "/exercises",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Calendario",
      description: "Visualizza e traccia il tuo programma di allenamento",
      icon: Calendar,
      path: "/calendar",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Allenamento Attivo",
      description: "Inizia la tua sessione di allenamento",
      icon: Timer,
      path: "/training",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-outfit">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bodyweight
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Il tuo compagno completo per gestire routine, tracciare progressi e raggiungere i tuoi obiettivi di fitness
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <Edit className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300">Routine Attive</span>
            </div>
            <div className="text-2xl font-bold text-white">{activeRoutines}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">Workout Completati</span>
            </div>
            <div className="text-2xl font-bold text-white">{completedWorkouts}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-slate-300">Totale Routine</span>
            </div>
            <div className="text-2xl font-bold text-white">{routines.length}</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-300 mb-4">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50"
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

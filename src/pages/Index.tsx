
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Timer, Edit, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Routines",
      description: "Create and manage your training routines",
      icon: Edit,
      path: "/routines",
      gradient: "from-lime-500 to-green-600"
    },
    {
      title: "Exercise Library",
      description: "Browse and manage your exercise database",
      icon: Heart,
      path: "/exercises",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Calendar",
      description: "View and track your workout schedule",
      icon: Calendar,
      path: "/calendar",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Active Training",
      description: "Start your workout session",
      icon: Timer,
      path: "/training",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
            Bodyweight
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your complete training companion for managing routines, tracking progress, and achieving your fitness goals
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-lime-400">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-lime-500/30 text-lime-400 hover:bg-lime-500/10 hover:border-lime-400"
                >
                  Open {feature.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="text-2xl font-bold text-lime-400 mb-2">0</div>
              <div className="text-gray-300">Active Routines</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="text-2xl font-bold text-lime-400 mb-2">0</div>
              <div className="text-gray-300">Exercises</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="text-2xl font-bold text-lime-400 mb-2">0</div>
              <div className="text-gray-300">Workouts Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

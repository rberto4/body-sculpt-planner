
import { Button } from "@/components/ui/button";
import { Calendar, Timer, Edit, Heart, Home, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Edit, label: "Routines", path: "/routines" },
    { icon: Heart, label: "Exercises", path: "/exercises" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Timer, label: "Training", path: "/training" },
    { icon: TrendingUp, label: "Progress", path: "/progress" },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="text-xl font-bold text-lime-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Bodyweight
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/" && location.pathname.startsWith(item.path));
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`${
                    isActive 
                      ? "bg-lime-500 text-black hover:bg-lime-400" 
                      : "text-gray-300 hover:text-lime-400 hover:bg-gray-700/50"
                  } transition-colors`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex space-x-1">
            {navItems.slice(1, 4).map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/" && location.pathname.startsWith(item.path));
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`${
                    isActive 
                      ? "bg-lime-500 text-black" 
                      : "text-gray-300 hover:text-lime-400"
                  } p-2`}
                >
                  <item.icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

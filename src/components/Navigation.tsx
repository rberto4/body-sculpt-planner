
import { Button } from "@/components/ui/button";
import { Calendar, Timer, Edit, Heart, Home, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Edit, label: "Routine", path: "/routines" },
    { icon: Heart, label: "Esercizi", path: "/exercises" },
    { icon: Calendar, label: "Calendario", path: "/calendar" },
    { icon: TrendingUp, label: "Progressi", path: "/progress" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
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
                        ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                    } transition-colors`}
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex space-x-1">
              {navItems.slice(0, 4).map((item) => {
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
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    } p-2`}
                  >
                    <item.icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div 
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
            onClick={() => navigate("/")}
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Bodyweight
          </div>
        </div>
      </div>
    </nav>
  );
};

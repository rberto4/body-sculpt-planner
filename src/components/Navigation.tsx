
import { Button } from "@/components/ui/button";
import { Calendar, Timer, Edit, Heart, Home, TrendingUp, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Edit, label: "Routine", path: "/routines" },
    { icon: Heart, label: "Esercizi", path: "/exercises" },
    { icon: Calendar, label: "Calendario", path: "/calendar" },
    { icon: Timer, label: "Allenamento", path: "/training" },
    { icon: TrendingUp, label: "Progressi", path: "/progress" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="text-xl font-bold text-gray-900 cursor-pointer"
            onClick={() => navigate("/")}
            style={{ fontFamily: 'Outfit, sans-serif' }}
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
                      ? "bg-gray-900 text-white hover:bg-gray-800" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  } transition-colors`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm hidden md:block">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-500"
            >
              <LogOut className="w-4 h-4" />
            </Button>
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
                      ? "bg-gray-900 text-white" 
                      : "text-gray-600 hover:text-gray-900"
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

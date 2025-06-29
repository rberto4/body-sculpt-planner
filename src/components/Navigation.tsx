import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, Timer, Edit, Heart, Home, TrendingUp, Menu, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Edit, label: "Routine", path: "/routines" },
    { icon: Heart, label: "Esercizi", path: "/exercises" },
    { icon: Calendar, label: "Calendario", path: "/calendar" },
    { icon: TrendingUp, label: "Progressi", path: "/progress" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo a sinistra */}
            <div 
              className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
              onClick={() => navigate("/")}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Bodyweight
            </div>

            {/* Desktop Navigation - Pulsanti a destra */}
            <div className="hidden md:flex items-center space-x-1">
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
              
              {/* Profilo Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <User className="w-4 h-4 mr-2" />
                Profilo
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </div>

            {/* Mobile Navigation - Profilo in alto a destra */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center px-2 py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="icon"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center flex-1 px-1 py-2 rounded-none border-none ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}
                style={{ background: 'none', boxShadow: 'none' }}
              >
                <span className="flex flex-col items-center gap-0.5">
                  <item.icon className="w-6 h-6 mb-0" />
                  <span className="text-xs font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.label}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

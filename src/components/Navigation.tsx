
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

          {/* Mobile Navigation - Hamburger Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] bg-white dark:bg-gray-900">
                <div className="flex flex-col space-y-2 mt-8">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== "/" && location.pathname.startsWith(item.path));
                    
                    return (
                      <Button
                        key={item.path}
                        variant={isActive ? "default" : "ghost"}
                        className={`justify-start ${
                          isActive 
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                            : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        }`}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
                  
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profilo
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Esci
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

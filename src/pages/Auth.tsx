
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, fullName);
      }

      if (result.error) {
        toast({
          title: "Errore",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        if (isLogin) {
          navigate("/");
          toast({
            title: "Benvenuto!",
            description: "Login effettuato con successo.",
          });
        } else {
          toast({
            title: "Registrazione completata!",
            description: "Controlla la tua email per confermare l'account.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore imprevisto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lime-400 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Bodyweight
          </h1>
          <p className="text-gray-300">Il tuo compagno di allenamento</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-lime-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {isLogin ? "Accedi" : "Registrati"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Il tuo nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-lime-500"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="la-tua-email@esempio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-lime-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="La tua password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-lime-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-lime-500 hover:bg-lime-400 text-black font-semibold py-2 h-11"
                disabled={loading}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {loading ? "Caricamento..." : (isLogin ? "Accedi" : "Registrati")}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-300 hover:text-lime-400"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {isLogin 
                  ? "Non hai un account? Registrati" 
                  : "Hai già un account? Accedi"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

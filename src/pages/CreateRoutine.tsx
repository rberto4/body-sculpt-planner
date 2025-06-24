
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateRoutine } from "@/hooks/useSupabaseQuery";

const CreateRoutine = () => {
  const navigate = useNavigate();
  const createRoutineMutation = useCreateRoutine();
  
  const [routineName, setRoutineName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [customType, setCustomType] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [volume, setVolume] = useState("Medium");

  const predefinedTypes = [
    "Braccia", "Gambe", "Petto", "Schiena", "Push", "Pull", 
    "Cardio", "Full Body", "Core", "Spalle"
  ];

  const daysOfWeek = [
    "Lunedì", "Martedì", "Mercoledì", "Giovedì", 
    "Venerdì", "Sabato", "Domenica"
  ];

  const volumes = ["Low", "Medium", "High"];

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setCustomType("");
  };

  const handleCustomTypeChange = (value: string) => {
    setCustomType(value);
    setSelectedType("");
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    const routineData = {
      name: routineName,
      type: selectedType || customType,
      assigned_days: selectedDays,
      is_assigned: selectedDays.length > 0,
      volume
    };

    await createRoutineMutation.mutateAsync(routineData);
    navigate("/routines");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/routines")}
            className="mr-4 text-gray-300 hover:text-lime-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-lime-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Crea Nuova Routine
            </h1>
            <p className="text-gray-300 mt-1">Configura la tua routine di allenamento</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Routine Name */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Nome della Routine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="routineName" className="text-gray-300">
                Inserisci un nome per la tua routine
              </Label>
              <Input
                id="routineName"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="es. Upper Body Power"
                className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </CardContent>
          </Card>

          {/* Routine Type */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Tipo di Routine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label className="text-gray-300">
                Scegli un tipo predefinito o creane uno personalizzato
              </Label>
              
              {/* Predefined Types */}
              <div className="flex flex-wrap gap-2">
                {predefinedTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedType === type 
                        ? "bg-lime-500 text-black hover:bg-lime-400" 
                        : "border-gray-500 text-gray-300 hover:border-lime-400 hover:text-lime-400"
                    }`}
                    onClick={() => handleTypeSelect(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>

              {/* Custom Type */}
              <div className="mt-4">
                <Label htmlFor="customType" className="text-gray-300">
                  Oppure crea un tipo personalizzato
                </Label>
                <Input
                  id="customType"
                  value={customType}
                  onChange={(e) => handleCustomTypeChange(e.target.value)}
                  placeholder="Inserisci tipo personalizzato"
                  className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Volume */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Volume di Allenamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {volumes.map((vol) => (
                  <Badge
                    key={vol}
                    variant={volume === vol ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      volume === vol 
                        ? "bg-lime-500 text-black hover:bg-lime-400" 
                        : "border-gray-500 text-gray-300 hover:border-lime-400 hover:text-lime-400"
                    }`}
                    onClick={() => setVolume(vol)}
                  >
                    {vol}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assigned Days */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Giorni Assegnati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-gray-300 mb-4 block">
                Seleziona i giorni in cui questa routine sarà attiva
              </Label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex items-center space-x-2 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleDayToggle(day)}
                  >
                    <Checkbox
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="border-gray-500"
                    />
                    <Label className="text-gray-300 cursor-pointer">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedDays.length > 0 && (
                <div className="mt-4">
                  <Label className="text-gray-300 mb-2 block">Giorni Selezionati:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDays.map((day) => (
                      <Badge
                        key={day}
                        variant="default"
                        className="bg-lime-500 text-black"
                      >
                        {day}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDayToggle(day);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/routines")}
              className="flex-1 border-gray-600 text-gray-300 hover:border-gray-500"
            >
              Annulla
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!routineName || (!selectedType && !customType) || createRoutineMutation.isPending}
              className="flex-1 bg-lime-500 hover:bg-lime-400 text-black font-semibold disabled:opacity-50"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {createRoutineMutation.isPending ? (
                "Creazione..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crea Routine
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;

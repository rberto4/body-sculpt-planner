
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateRoutine = () => {
  const navigate = useNavigate();
  const [routineName, setRoutineName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [customType, setCustomType] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const predefinedTypes = [
    "Arms", "Legs", "Chest", "Back", "Push", "Pull", 
    "Cardio", "Full Body", "Core", "Shoulders"
  ];

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday", "Sunday"
  ];

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

  const handleSubmit = () => {
    // Here you would typically save the routine
    console.log({
      name: routineName,
      type: selectedType || customType,
      assignedDays: selectedDays
    });
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
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-lime-400">Create New Routine</h1>
            <p className="text-gray-300 mt-1">Set up your training routine</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Routine Name */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400">Routine Name</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="routineName" className="text-gray-300">
                Enter a name for your routine
              </Label>
              <Input
                id="routineName"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="e.g., Upper Body Power"
                className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </CardContent>
          </Card>

          {/* Routine Type */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400">Routine Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label className="text-gray-300">
                Choose a predefined type or create a custom one
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
                  Or create a custom type
                </Label>
                <Input
                  id="customType"
                  value={customType}
                  onChange={(e) => handleCustomTypeChange(e.target.value)}
                  placeholder="Enter custom type"
                  className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Assigned Days */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lime-400">Assigned Days</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-gray-300 mb-4 block">
                Select the days when this routine will be active
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
                  <Label className="text-gray-300 mb-2 block">Selected Days:</Label>
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
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!routineName || (!selectedType && !customType)}
              className="flex-1 bg-lime-500 hover:bg-lime-400 text-black font-semibold disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Routine
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;

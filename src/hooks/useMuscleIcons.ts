
const muscleIconMap: Record<string, string> = {
  'Petto': '/src/assets/muscle_images/chest.png',
  'Schiena': '/src/assets/muscle_images/back.png',
  'Spalle': '/src/assets/muscle_images/shoulders.png',
  'Braccia': '/src/assets/muscle_images/biceps.png',
  'Bicipiti': '/src/assets/muscle_images/biceps.png',
  'Tricipiti': '/src/assets/muscle_images/triceps.png',
  'Gambe': '/src/assets/muscle_images/legs.png',
  'Quadricipiti': '/src/assets/muscle_images/legs.png',
  'Femorali': '/src/assets/muscle_images/hamstrings.png',
  'Glutei': '/src/assets/muscle_images/glutes.png',
  'Polpacci': '/src/assets/muscle_images/calfs.png',
  'Addominali': '/src/assets/muscle_images/core.png',
  'Core': '/src/assets/muscle_images/core.png',
  'Cardio': '/src/assets/muscle_images/core.png',
  'Full Body': '/src/assets/muscle_images/core.png'
};

export const useMuscleIcon = (muscleGroup: string): string => {
  return muscleIconMap[muscleGroup] || '/src/assets/muscle_images/core.png';
};

export const MuscleIcon = ({ muscleGroup, className = "w-6 h-6" }: { muscleGroup: string; className?: string }) => {
  const iconSrc = useMuscleIcon(muscleGroup);
  
  return (
    <img 
      src={iconSrc} 
      alt={muscleGroup}
      className={className}
    />
  );
};

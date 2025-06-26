
import React from 'react';
import backIcon from '@/assets/muscle_images/back.png';
import bicepsIcon from '@/assets/muscle_images/biceps.png';
import calfsIcon from '@/assets/muscle_images/calfs.png';
import chestIcon from '@/assets/muscle_images/chest.png';
import coreIcon from '@/assets/muscle_images/core.png';
import glutesIcon from '@/assets/muscle_images/glutes.png';
import hamstringsIcon from '@/assets/muscle_images/hamstrings.png';
import legsIcon from '@/assets/muscle_images/legs.png';
import shouldersIcon from '@/assets/muscle_images/shoulders.png';
import tricepsIcon from '@/assets/muscle_images/triceps.png';

export const useMuscleIcons = () => {
  const getMuscleIcon = (muscleGroup: string): string => {
    const icons: { [key: string]: string } = {
      'schiena': backIcon,
      'back': backIcon,
      'bicipiti': bicepsIcon,
      'biceps': bicepsIcon,
      'polpacci': calfsIcon,
      'calfs': calfsIcon,
      'petto': chestIcon,
      'chest': chestIcon,
      'core': coreIcon,
      'addome': coreIcon,
      'glutei': glutesIcon,
      'glutes': glutesIcon,
      'femorali': hamstringsIcon,
      'hamstrings': hamstringsIcon,
      'gambe': legsIcon,
      'legs': legsIcon,
      'quadricipiti': legsIcon,
      'spalle': shouldersIcon,
      'shoulders': shouldersIcon,
      'tricipiti': tricepsIcon,
      'triceps': tricepsIcon,
    };
    
    // Normalize the muscle group name to lowercase for matching
    const normalizedGroup = muscleGroup.toLowerCase().trim();
    return icons[normalizedGroup] || chestIcon;
  };

  return { getMuscleIcon };
};

export const MuscleIcon = ({ muscleGroup, className = "w-6 h-6" }: { muscleGroup: string; className?: string }) => {
  const { getMuscleIcon } = useMuscleIcons();
  
  return (
    <img 
      src={getMuscleIcon(muscleGroup)} 
      alt={muscleGroup} 
      className={className}
    />
  );
};

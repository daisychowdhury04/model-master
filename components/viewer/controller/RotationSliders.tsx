import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RotationSlidersProps {
  selectedGroup: string;
  selectedPart: string;
  rotation: { x: number; y: number; z: number };
  onRotationChange: (axis: 'x' | 'y' | 'z', value: number) => void;
}


export const RotationSliders = ({ selectedGroup, selectedPart, rotation, onRotationChange }: RotationSlidersProps) => {
  if (!selectedGroup || !selectedPart) return null;

  const handleSliderChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    onRotationChange(axis, value[0]);
  };

  const handleInputChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onRotationChange(axis, numValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>X Rotation</Label>
          <Input
            type="number"
            value={rotation.x}
            onChange={(e) => handleInputChange('x', e.target.value)}
            className="w-20 h-8"
          />
        </div>
        <Slider
          value={[rotation.x]}
          onValueChange={(value) => handleSliderChange('x', value)}
          min={-180}
          max={180}
          step={1}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Y Rotation</Label>
          <Input
            type="number"
            value={rotation.y}
            onChange={(e) => handleInputChange('y', e.target.value)}
            className="w-20 h-8"
          />
        </div>
        <Slider
          value={[rotation.y]}
          onValueChange={(value) => handleSliderChange('y', value)}
          min={-180}
          max={180}
          step={1}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Z Rotation</Label>
          <Input
            type="number"
            value={rotation.z}
            onChange={(e) => handleInputChange('z', e.target.value)}
            className="w-20 h-8"
          />
        </div>
        <Slider
          value={[rotation.z]}
          onValueChange={(value) => handleSliderChange('z', value)}
          min={-180}
          max={180}
          step={1}
        />
      </div>
    </div>
  );
}; 
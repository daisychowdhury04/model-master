import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { boneGroups } from '../../boneConfig';

interface PartSelectorProps {
  selectedGroup: string;
  selectedPart: string;
  onPartChange: (part: string) => void;
}

export const PartSelector = ({ selectedGroup, selectedPart, onPartChange }: PartSelectorProps) => (
  selectedGroup ? (
    <Select value={selectedPart} onValueChange={onPartChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Part" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(boneGroups[selectedGroup] || {}).map(part => (
          <SelectItem key={part} value={part}>
            {part}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : null
); 
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { boneGroups } from '../../boneConfig';

interface GroupSelectorProps {
  selectedGroup: string;
  onGroupChange: (group: string) => void;
}

export const GroupSelector = ({ selectedGroup, onGroupChange }: GroupSelectorProps) => (
  <Select value={selectedGroup} onValueChange={onGroupChange}>
    <SelectTrigger>
      <SelectValue placeholder="Select Group" />
    </SelectTrigger>
    <SelectContent>
      {Object.keys(boneGroups).map(group => (
        <SelectItem key={group} value={group}>
          {group}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
); 
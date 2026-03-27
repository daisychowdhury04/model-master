import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BoneInfo {
  name: string;
  children: string[];
  parent: string | null;
}

interface ModelBoneStructure {
  bones: BoneInfo[];
  hierarchy: Record<string, string[]>;
}

interface BoneListProps {
  boneStructure: ModelBoneStructure | null;
}

const BoneList: React.FC<BoneListProps> = ({ boneStructure }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    rightHand: true,
    leftHand: true,
    arms: true,
    head: true,
    spine: true,
    legs: true
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const groupBones = (bones: BoneInfo[]) => {
    const groups = {
      rightHand: {
        Hand: bones.filter(bone => bone.name.includes('RightHand') && !bone.name.includes('Thumb') && !bone.name.includes('Index') && !bone.name.includes('Middle') && !bone.name.includes('Ring') && !bone.name.includes('Pinky')),
        Thumb: bones.filter(bone => bone.name.includes('RightHandThumb')),
        Index: bones.filter(bone => bone.name.includes('RightHandIndex')),
        Middle: bones.filter(bone => bone.name.includes('RightHandMiddle')),
        Ring: bones.filter(bone => bone.name.includes('RightHandRing')),
        Pinky: bones.filter(bone => bone.name.includes('RightHandPinky'))
      },
      leftHand: {
        Hand: bones.filter(bone => bone.name.includes('LeftHand') && !bone.name.includes('Thumb') && !bone.name.includes('Index') && !bone.name.includes('Middle') && !bone.name.includes('Ring') && !bone.name.includes('Pinky')),
        Thumb: bones.filter(bone => bone.name.includes('LeftHandThumb')),
        Index: bones.filter(bone => bone.name.includes('LeftHandIndex')),
        Middle: bones.filter(bone => bone.name.includes('LeftHandMiddle')),
        Ring: bones.filter(bone => bone.name.includes('LeftHandRing')),
        Pinky: bones.filter(bone => bone.name.includes('LeftHandPinky'))
      },
      arms: {
        RightShoulder: bones.filter(bone => bone.name.includes('RightShoulder')),
        RightArm: bones.filter(bone => bone.name.includes('RightArm')),
        RightForeArm: bones.filter(bone => bone.name.includes('RightForeArm')),
        LeftShoulder: bones.filter(bone => bone.name.includes('LeftShoulder')),
        LeftArm: bones.filter(bone => bone.name.includes('LeftArm')),
        LeftForeArm: bones.filter(bone => bone.name.includes('LeftForeArm'))
      },
      head: {
        Neck: bones.filter(bone => bone.name.includes('Neck')),
        Head: bones.filter(bone => bone.name.includes('Head') && !bone.name.includes('Top')),
        HeadTop: bones.filter(bone => bone.name.includes('HeadTop')),
        Eyes: bones.filter(bone => bone.name.includes('Eye'))
      },
      spine: {
        Root: bones.filter(bone => bone.name.includes('Root')),
        Hips: bones.filter(bone => bone.name.includes('Hips')),
        Spine: bones.filter(bone => bone.name.includes('Spine') && !bone.name.includes('1') && !bone.name.includes('2')),
        Spine1: bones.filter(bone => bone.name.includes('Spine1')),
        Spine2: bones.filter(bone => bone.name.includes('Spine2'))
      },
      legs: {
        RightUpLeg: bones.filter(bone => bone.name.includes('RightUpLeg')),
        RightLeg: bones.filter(bone => bone.name.includes('RightLeg')),
        RightFoot: bones.filter(bone => bone.name.includes('RightFoot')),
        RightToeBase: bones.filter(bone => bone.name.includes('RightToeBase')),
        RightToeEnd: bones.filter(bone => bone.name.includes('RightToe_End')),
        LeftUpLeg: bones.filter(bone => bone.name.includes('LeftUpLeg')),
        LeftLeg: bones.filter(bone => bone.name.includes('LeftLeg')),
        LeftFoot: bones.filter(bone => bone.name.includes('LeftFoot')),
        LeftToeBase: bones.filter(bone => bone.name.includes('LeftToeBase')),
        LeftToeEnd: bones.filter(bone => bone.name.includes('LeftToe_End'))
      }
    };

    return groups;
  };

  const renderBoneGroup = (title: string, group: Record<string, BoneInfo[]>, groupKey: string) => {
    const isExpanded = expandedGroups[groupKey];
    
    return (
      <div key={groupKey} className="mb-4">
        <div 
          className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100 rounded"
          onClick={() => toggleGroup(groupKey)}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="font-semibold">{title}</span>
        </div>
        {isExpanded && (
          <div className="pl-6">
            {Object.entries(group).map(([subGroup, bones]) => (
              <div key={subGroup} className="mb-2">
                <div className="font-medium text-gray-700">{subGroup}:</div>
                <div className="pl-4">
                  {bones.map(bone => (
                    <div key={bone.name} className="text-sm text-gray-600">
                      {bone.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!boneStructure) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bone Structure</DialogTitle>
        </DialogHeader>
        <p className="text-gray-500">No bone structure available</p>
      </DialogContent>
    );
  }

  const groupedBones = groupBones(boneStructure.bones);

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Bone Structure</DialogTitle>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto">
        {renderBoneGroup('Right Hand', groupedBones.rightHand, 'rightHand')}
        {renderBoneGroup('Left Hand', groupedBones.leftHand, 'leftHand')}
        {renderBoneGroup('Arms', groupedBones.arms, 'arms')}
        {renderBoneGroup('Head', groupedBones.head, 'head')}
        {renderBoneGroup('Spine', groupedBones.spine, 'spine')}
        {renderBoneGroup('Legs', groupedBones.legs, 'legs')}
      </div>
    </DialogContent>
  );
};

export default BoneList; 
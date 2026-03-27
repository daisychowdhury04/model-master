import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Info, Zap, Eye, EyeOff, Settings } from "lucide-react";
import { testSequences } from '../../animations/sequences/Data/test/testSequences';

interface TestSequencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlaySequence: (sequenceName: string, disabledPoses?: number[]) => void;
}

export const TestSequencesDialog = ({ open, onOpenChange, onPlaySequence }: TestSequencesDialogProps) => {
  const [disabledPoses, setDisabledPoses] = useState<Record<string, number[]>>({});
  const [showPoseControls, setShowPoseControls] = useState<Record<string, boolean>>({});

  // Dynamically generate categories based on sequence names
  const generateSequenceCategories = () => {
    const categories: Record<string, string[]> = {};
    
    Object.keys(testSequences).forEach(sequenceName => {
      let category = "Other";
      
      // Auto-categorize based on sequence name patterns
      if (sequenceName.includes('PALM_')) {
        if (sequenceName.includes('FINGERS_') || sequenceName.includes('_FINGERS_')) {
          category = "Palm + Finger Combos";
        } else if (sequenceName.includes('ROLL_')) {
          category = "Palm Rolls";
        } else if (sequenceName.includes('DIAGONAL') || sequenceName.includes('NORTHEAST') || sequenceName.includes('NORTHWEST') || sequenceName.includes('SOUTHEAST') || sequenceName.includes('SOUTHWEST')) {
          category = "Palm Diagonals";
        } else if (sequenceName.includes('UP') || sequenceName.includes('DOWN')) {
          category = "Palm Up/Down";
        } else if (sequenceName.includes('NORTH') || sequenceName.includes('EAST') || sequenceName.includes('SOUTH') || sequenceName.includes('WEST')) {
          category = "Palm Directions";
        } else {
          category = "Palm Orientations";
        }
      } else if (sequenceName.includes('HAND_')) {
        category = "Hand Gestures";
      } else if (sequenceName.includes('FINGERS_')) {
        category = "Finger Movements";
      } else if (sequenceName.includes('CIRCLE') || sequenceName.includes('FIGURE_8')) {
        category = "Sequential Patterns";
      } else if (sequenceName.includes('LEGACY') || sequenceName.includes('CUSTOM') || sequenceName.includes('QUICK')) {
        category = "Special Tests";
      } else if (sequenceName.includes('RIGHT_')) {
        category = "Right Hand Actions";
      } else if (sequenceName.includes('LEFT_')) {
        category = "Left Hand Actions";
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(sequenceName);
    });
    
    return categories;
  };

  const sequenceCategories = generateSequenceCategories();

  const getSequenceLength = (sequenceName: string) => {
    const sequence = testSequences[sequenceName as keyof typeof testSequences];
    return sequence ? sequence.length : 0;
  };

  const togglePoseControl = (sequenceName: string) => {
    setShowPoseControls(prev => ({
      ...prev,
      [sequenceName]: !prev[sequenceName]
    }));
  };

  const togglePose = (sequenceName: string, poseIndex: number) => {
    setDisabledPoses(prev => {
      const current = prev[sequenceName] || [];
      const newDisabled = current.includes(poseIndex)
        ? current.filter(i => i !== poseIndex)
        : [...current, poseIndex];
      
      return {
        ...prev,
        [sequenceName]: newDisabled
      };
    });
  };

  const handlePlaySequence = (sequenceName: string) => {
    const disabled = disabledPoses[sequenceName] || [];
    console.log(`Playing sequence: ${sequenceName} with disabled poses:`, disabled);
    onPlaySequence(sequenceName, disabled);
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Palm')) return '🤚';
    if (category.includes('Finger')) return '👆';
    if (category.includes('Hand')) return '✋';
    if (category.includes('Pattern')) return '🔄';
    if (category.includes('Special')) return '⚡';
    if (category.includes('Right')) return '👉';
    if (category.includes('Left')) return '👈';
    return '🎯';
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Palm')) return 'from-blue-500 to-cyan-500';
    if (category.includes('Finger')) return 'from-green-500 to-emerald-500';
    if (category.includes('Hand')) return 'from-purple-500 to-pink-500';
    if (category.includes('Pattern')) return 'from-orange-500 to-red-500';
    if (category.includes('Special')) return 'from-yellow-500 to-orange-500';
    if (category.includes('Right')) return 'from-indigo-500 to-blue-500';
    if (category.includes('Left')) return 'from-violet-500 to-purple-500';
    return 'from-gray-500 to-slate-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Test Sequences Library</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Test Sequences
            </h3>
            <p className="text-sm text-muted-foreground">
              Test palm orientations and finger movements
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[500px] w-full">
        <div className="space-y-4 pr-2">
          {Object.entries(sequenceCategories).map(([category, sequences]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-gradient-to-r ${getCategoryColor(category)} rounded-lg text-white text-lg`}>
                  {getCategoryIcon(category)}
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  {category}
                </h4>
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                  {sequences.length} sequences
                </span>
              </div>
              
              <div className="grid gap-3">
                {sequences.map((sequenceName) => {
                  const sequence = testSequences[sequenceName as keyof typeof testSequences];
                  if (!sequence) return null;
                  
                  const isPoseControlOpen = showPoseControls[sequenceName];
                  const currentDisabled = disabledPoses[sequenceName] || [];
                  
                  return (
                    <div
                      key={sequenceName}
                      className="group border-2 border-border/50 rounded-xl hover:border-primary/50 transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-background to-muted/30"
                    >
                      <div className="p-3 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <h5 className="font-semibold text-sm text-foreground truncate">
                              {sequenceName}
                            </h5>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 shrink-0">
                              {getSequenceLength(sequenceName)} poses
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => togglePoseControl(sequenceName)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handlePlaySequence(sequenceName)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Play
                            </Button>
                          </div>
                        </div>

                        {/* Pose Controls */}
                        {isPoseControlOpen && (
                          <div className="border-t pt-3 space-y-2">
                            <p className="text-xs text-muted-foreground font-medium">
                              Toggle poses to enable/disable them:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {sequence.map((pose: string, index: number) => {
                                const isDisabled = currentDisabled.includes(index);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => togglePose(sequenceName, index)}
                                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                                      isDisabled
                                        ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                    }`}
                                  >
                                    {isDisabled ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                    {pose}
                                  </button>
                                );
                              })}
                            </div>
                            {currentDisabled.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Disabled poses: {currentDisabled.length} of {sequence.length}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Pose List */}
                        <div className="flex flex-wrap gap-1">
                          {sequence.map((pose: string, index: number) => {
                            const isDisabled = currentDisabled.includes(index);
                            return (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  isDisabled
                                    ? 'bg-red-50 text-red-600 border border-red-200 line-through opacity-50'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {pose}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border-t pt-4">
          <Info className="h-4 w-4" />
          <span>
            Click the settings icon to control individual poses • All sequences respect playback speed
          </span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};

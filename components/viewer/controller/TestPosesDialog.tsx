import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Hand, HandMetal } from "lucide-react";
import { cn } from "@/lib/utils";
import { fingerPoses } from '../../animations/poses/Data/hand/fingerPoses';
import { handMovements } from '../../animations/poses/Data/hand/handMovements';
import { palmPoses } from '../../animations/poses/Data/hand/palmPoses';

interface TestPosesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayPose: (poseName: string) => void;
}

export const TestPosesDialog = ({ open, onOpenChange, onPlayPose }: TestPosesDialogProps) => {
  const [activeTab, setActiveTab] = useState("fingers");

  const handlePlayPose = (poseName: string) => {
    console.log(`Playing pose: ${poseName}`);
    onPlayPose(poseName);
  };

  const getFingerIcon = (fingerName: string) => {
    const name = fingerName.toLowerCase();
    if (name.includes('thumb')) return '👍';
    if (name.includes('index')) return '☝️';
    if (name.includes('middle')) return '🖕';
    if (name.includes('ring')) return '💍';
    if (name.includes('pinky')) return '🖕';
    return '👆';
  };

  const getHandIcon = (movementName: string) => {
    const name = movementName.toLowerCase();
    if (name.includes('forehead')) return '🤔';
    if (name.includes('chest')) return '🤚';
    if (name.includes('distance')) return '👋';
    return '✋';
  };

  const getPalmIcon = (palmName: string) => {
    const name = palmName.toLowerCase();
    if (name.includes('north')) return '⬆️';
    if (name.includes('east')) return '➡️';
    if (name.includes('south')) return '⬇️';
    if (name.includes('west')) return '⬅️';
    if (name.includes('up')) return '☝️';
    if (name.includes('down')) return '👇';
    if (name.includes('roll_left')) return '↺';
    if (name.includes('roll_right')) return '↻';
    return '🖐️';
  };

  const getFingerCategory = (poseName: string) => {
    if (poseName.includes('ALL_FINGERS')) return 'All Fingers';
    if (poseName.includes('THUMB')) return 'Thumb';
    if (poseName.includes('INDEX')) return 'Index';
    if (poseName.includes('MIDDLE')) return 'Middle';
    if (poseName.includes('RING')) return 'Ring';
    if (poseName.includes('PINKY')) return 'Pinky';
    return 'Other';
  };

  const getMovementCategory = (poseName: string) => {
    if (poseName.includes('FOREHEAD')) return 'To Forehead';
    if (poseName.includes('CHEST')) return 'To Chest';
    if (poseName.includes('DISTANCE')) return 'Distance Movements';
    return 'Other';
  };

  const getPalmCategory = (poseName: string) => {
    if (poseName.includes('CUSTOM')) return 'Custom';
    if (poseName.includes('ROLL')) return 'Roll';
    if (poseName.includes('UP') || poseName.includes('DOWN')) return 'Vertical';
    if (poseName.includes('NORTH') || poseName.includes('EAST') || poseName.includes('SOUTH') || poseName.includes('WEST')) {
      if (poseName.includes('NORTHEAST') || poseName.includes('NORTHWEST') || poseName.includes('SOUTHEAST') || poseName.includes('SOUTHWEST')) {
        return 'Diagonal';
      }
      return 'Cardinal';
    }
    return 'Basic';
  };

  // Group finger poses by category
  const groupedFingerPoses = Object.entries(fingerPoses).reduce((acc, [poseName, poseConfig]) => {
    const category = getFingerCategory(poseName);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ name: poseName, config: poseConfig });
    return acc;
  }, {} as Record<string, Array<{ name: string; config: typeof fingerPoses[keyof typeof fingerPoses] }>>);

  // Group hand movements by category
  const groupedHandMovements = Object.entries(handMovements).reduce((acc, [poseName, poseConfig]) => {
    const category = getMovementCategory(poseName);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ name: poseName, config: poseConfig });
    return acc;
  }, {} as Record<string, Array<{ name: string; config: typeof handMovements[keyof typeof handMovements] }>>);

  // Group palm poses by category
  const groupedPalmPoses = Object.entries(palmPoses).reduce((acc, [poseName, poseConfig]) => {
    const category = getPalmCategory(poseName);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ name: poseName, config: poseConfig });
    return acc;
  }, {} as Record<string, Array<{ name: string; config: typeof palmPoses[keyof typeof palmPoses] }>>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Test Poses Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Hand className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Test Poses
                </h3>
                <p className="text-sm text-muted-foreground">
                  Test individual finger poses, palm orientations, and hand movements
                </p>
              </div>
            </div>
          </div>

          {/* Custom Tabs Implementation */}
          <div className="w-full">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
              <button
                onClick={() => setActiveTab("fingers")}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1",
                  activeTab === "fingers"
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-muted hover:text-foreground"
                )}
              >
                <HandMetal className="h-4 w-4 mr-2" />
                Finger Poses
              </button>
              <button
                onClick={() => setActiveTab("palm")}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1",
                  activeTab === "palm"
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-muted hover:text-foreground"
                )}
              >
                🖐️ Palm Orientation
              </button>
              <button
                onClick={() => setActiveTab("hand")}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1",
                  activeTab === "hand"
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-muted hover:text-foreground"
                )}
              >
                <Hand className="h-4 w-4 mr-2" />
                Hand Movements
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "fingers" && (
              <div className="mt-4">
                <ScrollArea className="h-[500px] w-full">
                  <div className="space-y-4 pr-2">
                    {Object.entries(groupedFingerPoses).map(([category, poses]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-lg">
                            {getFingerIcon(category)}
                          </div>
                          <h4 className="text-lg font-semibold text-foreground">
                            {category}
                          </h4>
                          <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                            {poses.length} poses
                          </span>
                        </div>

                        <div className="grid gap-3">
                          {poses.map(({ name, config }) => (
                            <div
                              key={name}
                              className="group border-2 border-border/50 rounded-xl hover:border-primary/50 transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-background to-muted/30"
                            >
                              <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-lg">
                                      {getFingerIcon(name)}
                                    </span>
                                    <h5 className="font-semibold text-sm text-foreground truncate">
                                      {name}
                                    </h5>
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 shrink-0">
                                      {Math.round(config.duration / 1000 * 10) / 10}s
                                    </span>
                                  </div>

                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handlePlayPose(name)}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shrink-0"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Play
                                  </Button>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {config.bones.map((bone: string) => (
                                    <span
                                      key={bone}
                                      className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                    >
                                      {bone.replace('Right', '')}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {activeTab === "palm" && (
              <div className="mt-4">
                <ScrollArea className="h-[500px] w-full">
                  <div className="space-y-4 pr-2">
                    {Object.entries(groupedPalmPoses).map(([category, poses]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white text-lg">
                            {getPalmIcon(category)}
                          </div>
                          <h4 className="text-lg font-semibold text-foreground">
                            {category}
                          </h4>
                          <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                            {poses.length} poses
                          </span>
                        </div>

                        <div className="grid gap-3">
                          {poses.map(({ name, config }) => (
                            <div
                              key={name}
                              className="group border-2 border-border/50 rounded-xl hover:border-primary/50 transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-background to-muted/30"
                            >
                              <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-lg">
                                      {getPalmIcon(name)}
                                    </span>
                                    <h5 className="font-semibold text-sm text-foreground truncate">
                                      {name.replace('PALM_', '')}
                                    </h5>
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 shrink-0">
                                      {Math.round(config.duration / 1000 * 10) / 10}s
                                    </span>
                                  </div>

                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handlePlayPose(name)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shrink-0"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Play
                                  </Button>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {config.bones.map((bone: string) => (
                                    <span
                                      key={bone}
                                      className="px-2 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                                    >
                                      {bone.replace('Right', '')}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {activeTab === "hand" && (
              <div className="mt-4">
                <ScrollArea className="h-[500px] w-full">
                  <div className="space-y-4 pr-2">
                    {Object.entries(groupedHandMovements).map(([category, movements]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-lg">
                            {getHandIcon(category)}
                          </div>
                          <h4 className="text-lg font-semibold text-foreground">
                            {category}
                          </h4>
                          <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                            {movements.length} movements
                          </span>
                        </div>

                        <div className="grid gap-3">
                          {movements.map(({ name, config }) => (
                            <div
                              key={name}
                              className="group border-2 border-border/50 rounded-xl hover:border-primary/50 transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-background to-muted/30"
                            >
                              <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-lg">
                                      {getHandIcon(name)}
                                    </span>
                                    <h5 className="font-semibold text-sm text-foreground truncate">
                                      {name.replace('RIGHT_HAND_', '')}
                                    </h5>
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 shrink-0">
                                      {Math.round(config.duration / 1000 * 10) / 10}s
                                    </span>
                                  </div>

                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handlePlayPose(name)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shrink-0"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Play
                                  </Button>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {config.bones.map((bone: string) => (
                                    <span
                                      key={bone}
                                      className="px-2 py-1 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
                                    >
                                      {bone.replace('Right', '')}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border-t pt-4">
            <Hand className="h-4 w-4" />
            <span>
              Click play buttons to test individual poses, palm orientations, and movements • All respect playback speed
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

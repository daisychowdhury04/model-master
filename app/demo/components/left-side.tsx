"use client";

import React from "react";
import { PlaybackSpeedSlider } from "@/components/viewer/controller/PlaybackSpeedSlider";

interface LeftSidebarProps {
  playTokens: string[];
  activeWordIndex: number | null;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  playTokens,
  activeWordIndex,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
}) => {
  return (
    <div className="h-full w-80 border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-4">
        <h2 className="mb-4 text-lg font-semibold">Demo</h2>
        <p className="text-muted-foreground text-xs">
          Use the <strong className="text-foreground">Sign</strong> field at the bottom of the viewer. Words map to{" "}
          <code className="text-xs">signSequences</code> keys, then single poses.
        </p>

        <PlaybackSpeedSlider playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />

        {playTokens.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-muted-foreground text-xs font-medium">Sentence (word by word)</p>
            <div className="flex flex-wrap gap-1.5">
              {playTokens.map((token, i) => {
                const isActive = isPlaying && activeWordIndex === i;
                return (
                  <span
                    key={`${i}-${token}`}
                    className={
                      isActive
                        ? "rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900"
                        : "bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs"
                    }
                  >
                    {token}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;

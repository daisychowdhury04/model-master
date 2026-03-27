"use client";

import React, { forwardRef } from "react";
import SimpleModelViewer, { SimpleModelViewerRef } from "@/components/viewer/SimpleModelViewer";

interface RightSidebarProps {
  modelPath?: string;
  playbackSpeed?: number;
}

const RightSidebar = forwardRef<SimpleModelViewerRef, RightSidebarProps>(
  ({ modelPath = "/human.glb", playbackSpeed = 1, ...props }, ref) => {
    return (
      <div className="h-full flex-1">
        <SimpleModelViewer ref={ref} modelPath={modelPath} playbackSpeed={playbackSpeed} {...props} />
      </div>
    );
  }
);

RightSidebar.displayName = "RightSidebar";

export default RightSidebar;

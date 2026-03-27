"use client";

import React from "react";
import ThreeJSViewer from "@/components/ThreeJSViewer";
import { AppRoutesNav } from "@/components/nav/AppRoutesNav";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col">
      <AppRoutesNav />
      <div className="min-h-0 flex-1">
        <ThreeJSViewer />
      </div>
    </div>
  );
}

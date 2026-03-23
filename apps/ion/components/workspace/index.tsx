import React from "react";
import { Sidebar } from "./sidebar";
import { MainContent } from "./main-content";

export function Workspace() {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <MainContent />
    </div>
  );
}

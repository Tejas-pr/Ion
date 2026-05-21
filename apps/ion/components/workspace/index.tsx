import React from "react";
import { Sidebar } from "./sidebar";
import { MainContent } from "./main-content";

export function Workspace() {
  return (
    <div className="flex flex-1 w-full bg-background overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  );
}


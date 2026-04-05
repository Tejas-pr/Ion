import React from "react";
import { Sidebar } from "../workspace/sidebar";
import { MainContent } from "./main-content";

export function WorkspaceGithub() {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <MainContent />
    </div>
  );
}

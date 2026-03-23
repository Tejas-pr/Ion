"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { AddProjectModal } from "./add-project-modal";

export function MainContent() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Ion",
      description: "No Production Deployment",
      repo: "Tejas-pr/ion",
      link: "https://github.com/Tejas-pr/ion",
      status: "no-deployment",
      lastUpdate: "58s ago",
      branch: "main",
    },
    {
      id: 2,
      name: "sketchly",
      description: "drawing.tejasr.site",
      repo: "Tejas-pr/sketchly",
      link: "https://github.com/Tejas-pr/sketchly",
      status: "deployed",
      lastUpdate: "Feb 5 on master",
      branch: "master",
    },
    {
      id: 3,
      name: "space-ts-landingpage",
      description: "space-ts-landingpage.vercel.app",
      repo: "Tejas-pr/space-ts",
      link: "https://github.com/Tejas-pr/space-ts",
      status: "deployed",
      lastUpdate: "12/3/24 on master",
      branch: "master",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProject = (newProject: { name: string; link: string }) => {
    const project = {
      id: Math.max(...projects.map((p) => p.id), 0) + 1,
      name: newProject.name,
      description: "Recently added",
      repo: newProject.link.split("/").slice(-2).join("/"),
      link: newProject.link,
      status: "pending",
      lastUpdate: "just now",
      branch: "main",
    };
    setProjects([...projects, project]);
    setIsModalOpen(false);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-8">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground text-lg">
              No projects yet. Create your first project!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </main>
  );
}

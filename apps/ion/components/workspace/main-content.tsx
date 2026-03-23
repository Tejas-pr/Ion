"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { AddProjectModal } from "./add-project-modal";
import { getWorkspaceDetails, addNewProject } from "@/api/api.service";

export function MainContent() {
  const [projects, setProjects] = useState<any>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaceDetails();
  }, []);

  const fetchWorkspaceDetails = async () => {
    const data = await getWorkspaceDetails();
    setProjects(data.projects || []);
  };

  const handleAddProject = async (newProject: {
    name: string;
    link: string;
  }) => {
    try {
      await addNewProject(newProject.name, newProject.link);
      await fetchWorkspaceDetails();
    } catch (error) {
      console.error("Failed to add project:", error);
    }
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
            {projects.map((project: any) => (
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

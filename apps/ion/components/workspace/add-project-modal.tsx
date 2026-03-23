"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addNewProject } from "@/api/api.service";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: { name: string; link: string }) => void;
}

export function AddProjectModal({
  isOpen,
  onClose,
  onAddProject,
}: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!projectName.trim()) {
      setError("Project name is required");
      setIsSubmitting(false);
      return;
    }

    if (!projectLink.trim()) {
      setError("Project link is required");
      setIsSubmitting(false);
      return;
    }

    // Validate URL format
    const isValidUrl =
      projectLink.startsWith("http") || projectLink.startsWith("git@");
    if (!isValidUrl) {
      setError("Please enter a valid HTTP or Git SSH URL");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await addNewProject(
        projectName.trim(),
        projectLink.trim(),
      );

      // Clear fields
      setProjectName("");
      setProjectLink("");

      // Notify parent to update UI
      if (onAddProject) {
        onAddProject(response.project);
      }

      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to add project. Please check if the backend is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Add New Project
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., My Awesome App"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Project Link */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Git Repository Link
            </label>
            <input
              type="text"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              placeholder="e.g., https://github.com/username/repo"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Deploying..." : "Deploy"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

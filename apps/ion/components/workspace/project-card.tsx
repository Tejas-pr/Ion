import React from "react";
import { MoreVertical, AlertTriangle, CheckCircle2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  repo: string;
  status: "deployed" | "no-deployment" | "error";
  lastUpdate: string;
  branch: string;
}

export function ProjectCard({
  id,
  name,
  description,
  repo,
  status,
  lastUpdate,
  branch,
}: ProjectCardProps) {
  const isDeployed = status === "deployed";

  return (
    <div className="border rounded-lg p-4 hover:bg-accent/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{name}</h3>
            {isDeployed ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Repository Info */}
      <div className="space-y-2 mb-4 py-3 border-y">
        <div className="flex items-center gap-2 text-xs">
          <Github className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{repo}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
          <span className="text-xs text-muted-foreground">{branch}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground">{lastUpdate}</div>
    </div>
  );
}

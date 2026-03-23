import React from "react";
import { ExternalLink, Github, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  repo: string;
  link: string;
  status: string;
  lastUpdate: string;
  branch: string;
}

export function ProjectCard({
  id,
  name,
  description,
  repo,
  link,
  status,
  lastUpdate,
  branch,
}: ProjectCardProps) {
  const isDeployed = status === "deployed";

  return (
    <div className="border border-border rounded-lg p-5 hover:bg-accent/30 dark:hover:bg-accent/20 transition-all duration-200 bg-card text-card-foreground">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base text-foreground">{name}</h3>
            {isDeployed ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-foreground"
          asChild
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      {/* Repository Info */}
      <div className="space-y-2 mb-4 py-3 border-y border-border">
        <div className="flex items-center gap-2 text-sm">
          <Github className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors truncate"
          >
            {repo}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
          <span className="text-sm text-muted-foreground">{branch}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground">{lastUpdate}</div>
    </div>
  );
}

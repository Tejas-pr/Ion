import React from "react";
import { ExternalLink, Github, Calendar, Hash, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config";

interface ProjectCardProps {
  id: string;
  projectId: string;
  name: string;
  repoUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export function ProjectCard({
  id,
  projectId,
  name,
  repoUrl,
  createdAt,
  updatedAt,
  userId,
}: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Extract repo name from URL if possible
  const getRepoName = (url: string) => {
    if (url.startsWith("git@github.com:")) {
      return url.split(":")[1].replace(".git", "");
    }
    return url;
  };

  return (
    <div className="group border border-border rounded-xl p-6 hover:bg-accent/30 dark:hover:bg-accent/20 transition-all duration-300 bg-card text-card-foreground shadow-sm hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium uppercase tracking-wider">
              Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Hash className="w-3 h-3" />
            <span>ID: {projectId}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-all"
          asChild
        >
          <a
            href={
              repoUrl.startsWith("http")
                ? repoUrl
                : `https://github.com/${getRepoName(repoUrl)}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5" />
          </a>
        </Button>
      </div>

      {/* Details Section */}
      <div className="space-y-3 mb-6 py-4 border-y border-border/50">
        <div className="flex items-center gap-3 text-sm">
          <Github className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground font-medium truncate">
            {getRepoName(repoUrl)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created: {formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {formatDate(updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
          <User className="w-3 h-3" />
          <span className="truncate max-w-30">{userId}</span>
        </div>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary text-xs font-semibold"
          asChild
        >
          <a
            href={`http://${projectId}.${BASE_URL}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Detail <ExternalLink className="ml-1 w-3 h-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}

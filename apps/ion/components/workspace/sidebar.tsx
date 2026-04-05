'use client';

import React from "react";
import { Boxes, Github } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tab: string) => {
    router.push(tab);
  };

  return (
    <aside className="border-r border-border bg-card text-card-foreground overflow-y-auto flex flex-col w-64">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">T</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Tejas</p>
            <p className="text-xs text-muted-foreground">Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => handleTabChange("/workspace")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            pathname === "/workspace"
              ? "bg-primary/10 dark:bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/30 dark:hover:bg-accent/20"
          }`}
        >
          <Boxes className="w-5 h-5 flex-shrink-0" />
          <span className="text-left">My Projects</span>
        </button>

        <button
          onClick={() => handleTabChange("/github")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            pathname === "/github"
              ? "bg-primary/10 dark:bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/30 dark:hover:bg-accent/20"
          }`}
        >
          <Github className="w-5 h-5 flex-shrink-0" />
          <span className="text-left">From GitHub</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 dark:hover:bg-accent/20 rounded-lg text-left transition-colors">
          Settings
        </button>
        <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 dark:hover:bg-accent/20 rounded-lg text-left transition-colors">
          Help & Support
        </button>
      </div>
    </aside>
  );
}
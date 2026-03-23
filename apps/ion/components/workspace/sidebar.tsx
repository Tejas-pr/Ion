import React from "react";
import { ChevronRight, BarChart3, Boxes, Clock, Settings, FileText, AlertCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    icon: Boxes,
    label: "Projects",
    active: true,
  },
  {
    icon: Clock,
    label: "Deployments",
  },
  {
    icon: Clock,
    label: "Logs",
  },
  {
    icon: BarChart3,
    label: "Analytics",
  },
  {
    icon: Zap,
    label: "Speed Insights",
  },
  {
    icon: AlertCircle,
    label: "Observability",
  },
  {
    icon: FileText,
    label: "Firewall",
  },
  {
    icon: Settings,
    label: "Settings",
  },
];

export function Sidebar() {
  return (
    <aside className="w-52 border-r bg-card overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">T</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Tejas</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Find..."
          className="w-full px-3 py-2 rounded-md bg-background border text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        <button className="w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-md text-left transition-colors">
          Support
        </button>
        <div className="px-3 py-3 rounded-md bg-accent/30 border border-accent/20 text-xs">
          <div className="font-medium text-foreground mb-1">Action Required</div>
          <p className="text-muted-foreground">Take action to secure your projects from critical vulnerabilities.</p>
          <button className="mt-2 text-xs font-medium text-primary hover:underline">
            Update Projects
          </button>
        </div>
      </div>
    </aside>
  );
}

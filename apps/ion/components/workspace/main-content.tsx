import React from "react";
import { MoreVertical, Plus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { UsageSection } from "./usage-section";
import { AlertsSection } from "./alerts-section";
import { RecentPreviewsSection } from "./recent-previews-section";

export function MainContent() {
  const projects = [
    {
      id: 1,
      name: "Ion",
      description: "No Production Deployment",
      repo: "Tejas-pr/ion",
      status: "no-deployment",
      lastUpdate: "58s ago",
      branch: "main",
    },
    {
      id: 2,
      name: "sketchly",
      description: "drawing.tejasr.site",
      repo: "Tejas-pr/sketchly",
      status: "deployed",
      lastUpdate: "Feb 5 on master",
      branch: "master",
    },
    {
      id: 3,
      name: "space-ts-landingpage",
      description: "space-ts-landingpage.vercel.app",
      repo: "Tejas-pr/space-ts",
      status: "deployed",
      lastUpdate: "12/3/24 on master",
      branch: "master",
    },
    {
      id: 4,
      name: "navbar",
      description: "Component library",
      repo: "Tejas-pr/navbar",
      status: "deployed",
      lastUpdate: "2 weeks ago",
      branch: "main",
    },
    {
      id: 5,
      name: "ai-pdf-chatbot-fullstack",
      description: "ai-pdf-chatbot-fullstack.vercel.app",
      repo: "Tejas-pr/AI-PDF-Chatbot-F...",
      status: "deployed",
      lastUpdate: "11/13/24 on master",
      branch: "master",
    },
    {
      id: 6,
      name: "tejas-portfolio",
      description: "tejas.pr.site",
      repo: "Tejas-pr/tejas-portfolio",
      status: "deployed",
      lastUpdate: "1d ago on main",
      branch: "main",
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New...
          </Button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Usage and Alerts */}
          <div className="space-y-6">
            <UsageSection />
            <AlertsSection />
          </div>

          {/* Middle-Right column: Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Projects</CardTitle>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Previews Section */}
        <RecentPreviewsSection />
      </div>
    </main>
  );
}

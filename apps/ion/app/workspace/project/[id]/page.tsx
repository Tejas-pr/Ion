"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Terminal,
  ExternalLink,
  Github,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjectDetails } from "@/api/api.service";
import { BASE_URL, WEBSOCKET_URL } from "@/config";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
      connectWebSocket();
    }
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchProject = async () => {
    try {
      const data = await getProjectDetails(id as string);
      if (data.success) {
        setProject(data.project);
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(`${WEBSOCKET_URL}?projectId=${id}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setLogs((prev) => [...prev, "Connected to build server..."]);
    };

    ws.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setLogs((prev) => [...prev, "Disconnected from build server."]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLogs((prev) => [...prev, "Error connecting to build server."]);
    };

    return () => ws.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The project you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => router.push("/workspace")}>
          Back to Workspace
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "FAILED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "IN_QUEUE":
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20 animate-pulse";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/workspace")}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">{project.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ID: {project.projectId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                Repository
              </a>
            </Button>
            <Button
              size="sm"
              className="gap-2"
              asChild
              disabled={project.status !== "SUCCESS"}
            >
              <a
                href={`http://${project.projectId}.${BASE_URL}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                View Deployed
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Logs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0f1117] rounded-xl border border-border overflow-hidden h-[600px] flex flex-col shadow-2xl">
              <div className="bg-[#1a1d27] px-4 py-2 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Build Logs
                  </span>
                </div>
                <div className="flex gap-1.5 text-xs text-muted-foreground font-mono">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed selection:bg-primary/30"
              >
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground animate-pulse">
                    <Terminal className="w-8 h-8 mb-2 opacity-20" />
                    <p>Waiting for build logs...</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1">
                      <span className="text-primary/50 mr-2 select-none">
                        [{i + 1}]
                      </span>
                      <span className="text-slate-300 break-words">{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Deployment Info
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${project.status === "SUCCESS" ? "bg-green-500" : project.status === "FAILED" ? "bg-red-500" : "bg-blue-500 animate-pulse"}`}
                    />
                    <span className="text-sm font-medium">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Created At
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(project.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 pt-2 border-t border-border mt-4">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Project ID
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded w-fit">
                    {project.projectId}
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
              <h3 className="text-sm font-bold mb-2">Did you know?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your project is built inside an isolated Docker container and
                deployed to our distributed edge network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

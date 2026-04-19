import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { auth } from "@ion/auth/auth";
import { prisma } from "@ion/database";
import { getUserGitHubAccessToken } from "ion-common/redis";
import { REPO_BACKEND_URL } from "@/config";
import axios from "axios";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

console.log("ChatBot: API Key Loaded?", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log("ChatBot: Key Prefix:", process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 10) + "...");
}

export const maxDuration = 60;

export async function POST(req: Request) {
  console.log("ChatBot: POST request received");

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    console.error("ChatBot: Unauthorized - No session found");
    return new Response('Unauthorized', { status: 401 });
  }

  console.log("ChatBot: Session user", session.user.id);
  const { messages } = await req.json();
  console.log("ChatBot: Messages received:", JSON.stringify(messages, null, 2));

  try {
    const model = google('gemini-2.0-flash-001');
    console.log("ChatBot: Model initialized");

    const result = streamText({
      model,
      messages,
      maxSteps: 5,
      toolChoice: 'auto',
      onError: ({ error }) => {
        console.error("ChatBot Stream Error:", error);
      },
      system: `
You are Ion Bot, an AI assistant for the Ion deployment platform.

STRICT RULES:
- When user asks about repositories → ALWAYS call "list_repos"
- When user asks about deployments/status → ALWAYS call "get_deployment_status"
- When user wants to deploy → ALWAYS call "start_deployment"
- Map user nicknames (e.g., "my main app") to real repo names from the "list_repos" results.
- NEVER guess data when tools exist.
- Keep responses concise and professional.
`,
      tools: {
        list_repos: tool({
          description: "Get user's GitHub repositories",
          parameters: z.object({
            page: z.number().optional().default(1),
            perPage: z.number().optional().default(5),
          }),
          execute: async ({ page, perPage }) => {
            console.log("Fetching repos for user:", session.user.id);
            const accessToken = await getUserGitHubAccessToken(session.user.id);
            console.log("Access token found?", !!accessToken);

            if (!accessToken) {
              console.error("No GitHub token for user:", session.user.id);
              return { success: false, error: "No GitHub token found. Please sign in again." };
            }

            const response = await fetch(
              `https://api.github.com/user/repos?type=all&sort=pushed&direction=desc&page=${page}&per_page=${perPage}`,
              {
                headers: {
                  Authorization: `token ${accessToken}`,
                  Accept: "application/vnd.github+json",
                },
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error("GitHub API error:", errorText);
              throw new Error("Failed to fetch repositories from GitHub");
            }

            const data = await response.json();
            return data.map((repo: any) => ({
              name: repo.name,
              fullName: repo.full_name,
              url: repo.clone_url,
              description: repo.description,
              stars: repo.stargazers_count,
              private: repo.private,
            }));
          },
        }),
        get_deployment_status: tool({
          description: "Get user's deployment status",
          parameters: z.object({}),
          execute: async () => {
            const projects = await prisma.project.findMany({
              where: { userId: session.user.id },
              orderBy: { updatedAt: "desc" },
              include: {
                builds: {
                  take: 1,
                  orderBy: { createdAt: "desc" },
                },
              },
            });

            return projects.map((p) => ({
              name: p.name,
              projectId: p.projectId,
              status: p.status,
              updatedAt: p.updatedAt,
              lastBuildStatus: p.builds[0]?.status || "N/A",
            }));
          },
        }),
        start_deployment: tool({
          description: "Start a new deployment",
          parameters: z.object({
            name: z.string(),
            url: z.string(),
          }),
          execute: async ({ name, url }) => {
            try {
              const response = await axios.post(
                `${REPO_BACKEND_URL}/deploy`,
                { name, url },
                {
                  headers: {
                    Cookie: req.headers.get("cookie") || "",
                  },
                }
              );
              return { success: true, project: response.data };
            } catch (error: any) {
              console.error("Deployment error:", error?.response?.data || error.message);
              return { success: false, error: error?.response?.data || error.message };
            }
          },
        }),
      },
    });

    console.log("ChatBot: Stream initialized successfully");
    return result.toDataStreamResponse({
        getErrorMessage: (err: any) => err.message || "Unknown streaming error"
    });
  } catch (error: any) {
    console.error("ChatBot Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
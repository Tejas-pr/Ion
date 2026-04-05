import { WorkspaceGithub } from "@/components/github";

export const metadata = {
  title: "Github",
  description: "Manage your projects and deployments from Github.",
};

export default function WorkspacePage() {
  return <WorkspaceGithub />;
}

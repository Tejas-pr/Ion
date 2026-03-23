import { Workspace } from "@/components/workspace";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Workspace",
  description: "Manage your projects and deployments",
};

export default function WorkspacePage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Workspace />
    </ThemeProvider>
  );
}

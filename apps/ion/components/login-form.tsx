"use client";
import { GalleryVerticalEnd, Github } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signIn } from "@ion/auth/client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleGithubAuth = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/workspace",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center mb-6">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">Ion</span>
        </a>
        <h1 className="text-xl font-bold">Welcome back</h1>
        <p className="text-sm text-balance text-muted-foreground mt-2">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Sign up
          </a>
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          onClick={handleGithubAuth}
          variant="outline"
          type="button"
          className="w-full"
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>

      <p className="px-6 text-center text-xs text-muted-foreground mt-6">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

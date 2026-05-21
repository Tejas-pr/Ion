import { ArrowRight, Github, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-transparent pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Hero Content Wrapper */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="text-sm text-emerald-800 font-medium">
            ✨ Deploy projects seamlessly from GitHub
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-gray-950">
            The complete platform to{" "}
            <span className="bg-gradient-to-r from-gray-900 via-emerald-950 to-emerald-800 bg-clip-text text-transparent">
              deploy the web applications.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-emerald-950/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Your team's toolkit to stop configuring and start innovating.
            Securely build, deploy, and scale the best web experiences with Ion.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/github" className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors flex items-center gap-2 shadow-lg shadow-emerald-950/20">
            <Github size={18} />
            Import from GitHub
            <ArrowRight size={18} />
          </Link>
          <Link href="/workspace" className="px-8 py-3 border border-emerald-950/30 text-emerald-950 rounded-full font-semibold hover:bg-emerald-500/10 transition-colors flex items-center gap-2">
            <LayoutGrid size={18} />
            Go to Workspace
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="pt-12 grid grid-cols-3 gap-4 sm:gap-8 text-center border-t border-emerald-950/10">
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-gray-950">Git Connect</div>
            <p className="text-sm text-emerald-950/70 font-medium">
              Seamless import from your repositories.
            </p>
          </div>
          <div className="space-y-2 border-l border-r border-emerald-950/10">
            <div className="text-3xl sm:text-4xl font-bold text-gray-950">1-Click</div>
            <p className="text-sm text-emerald-950/70 font-medium">
              Auto-builds and instant deployments.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-gray-950">Zero Config</div>
            <p className="text-sm text-emerald-950/70 font-medium">
              Just push your code and we handle the rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}




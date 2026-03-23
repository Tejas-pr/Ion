import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full">
          <span className="text-sm text-gray-300">✨ New features available</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            The complete platform to{' '}
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              build the web.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best web experiences with Ion.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
            Get a demo
            <ArrowRight size={18} />
          </button>
          <button className="px-8 py-3 border border-white/30 text-white rounded-full font-semibold hover:border-white/60 hover:bg-white/5 transition-colors flex items-center gap-2">
            <Play size={18} />
            Watch Demo
          </button>
        </div>

        {/* Hero Image/Stats */}
        <div className="pt-12 grid grid-cols-3 gap-4 sm:gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold">20 days</div>
            <p className="text-sm text-gray-400">saved on daily builds</p>
          </div>
          <div className="space-y-2 border-l border-r border-white/10">
            <div className="text-3xl sm:text-4xl font-bold">98%</div>
            <p className="text-sm text-gray-400">faster time to market</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold">300%</div>
            <p className="text-sm text-gray-400">increase in SEO</p>
          </div>
        </div>
      </div>
    </section>
  );
}

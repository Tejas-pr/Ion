import { Search } from 'lucide-react';

export default function Collaboration() {
  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Collaboration</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Make teamwork
                <br />
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                  seamless.
                </span>
              </h2>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed">
              Tools for your team and stakeholders to share feedback and iterate faster. Keep everyone in sync with built-in collaboration features.
            </p>

            <ul className="space-y-4">
              {[
                'Real-time collaboration on deployments',
                'Team-based access controls',
                'Built-in commenting and feedback',
                'Performance monitoring dashboards',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-white text-base">{item}</span>
                </li>
              ))}
            </ul>

            <button className="mt-8 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Learn more
            </button>
          </div>

          {/* Right Side - Demo Interface */}
          <div className="relative">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 backdrop-blur-sm">
              {/* Search Bar */}
              <div className="mb-6 flex items-center gap-2 bg-black/50 border border-white/20 rounded-lg px-4 py-3">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-white placeholder-gray-600 outline-none flex-1 text-sm"
                />
                <span className="text-xs text-gray-600">⌘K</span>
              </div>

              {/* Sample Results */}
              <div className="space-y-3">
                {[
                  { label: 'monitoring-query-variant', icon: '📊' },
                  { label: 'enable-dashboard-recents', icon: '📈' },
                  { label: 'Select an override...', icon: '⚙️' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-black/30 border border-white/10 rounded hover:bg-black/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    {idx === 0 && (
                      <span className="text-xs text-gray-600 bg-white/10 px-2 py-1 rounded">↗</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

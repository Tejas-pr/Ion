import { Search } from 'lucide-react';
import Link from 'next/link';

export default function Collaboration() {
  return (
    <section className="bg-transparent py-20 px-4 sm:px-6 lg:px-8 border-t border-emerald-500/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Collaboration</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-gray-950">
                Make teamwork
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-emerald-950 to-emerald-800 bg-clip-text text-transparent">
                  seamless.
                </span>
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed font-medium">
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
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                  <span className="text-gray-800 text-base font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/signup" className="inline-block mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors shadow-md shadow-emerald-950/15">
              Learn more
            </Link>
          </div>

          {/* Right Side - Demo Interface */}
          <div className="relative">
            <div className="bg-white/70 border border-emerald-500/10 rounded-lg p-6 sm:p-8 backdrop-blur-sm shadow-lg shadow-emerald-950/5">
              {/* Search Bar */}
              <div className="mb-6 flex items-center gap-2 bg-gray-50 border border-emerald-500/10 rounded-lg px-4 py-3">
                <Search className="w-4 h-4 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-gray-900 placeholder-gray-400 outline-none flex-1 text-sm font-medium"
                  readOnly
                />
                <span className="text-xs text-gray-400 bg-gray-200/50 px-1.5 py-0.5 rounded font-medium">⌘K</span>
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
                    className="flex items-center justify-between p-3 bg-white/80 border border-emerald-500/5 rounded hover:bg-emerald-50/50 hover:border-emerald-500/10 transition-colors cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm text-gray-700 font-semibold">{item.label}</span>
                    </div>
                    {idx === 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2 py-1 rounded">↗</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}


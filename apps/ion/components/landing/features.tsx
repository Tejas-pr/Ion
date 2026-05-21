import { Code2, Zap, Lock, BarChart3 } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Code2,
      title: 'Faster iteration.',
      subtitle: 'More innovation.',
      description: 'The platform for rapid progress. Let your team focus on shipping features instead of managing infrastructure.',
    },
    {
      icon: Zap,
      title: 'Make teamwork',
      subtitle: 'seamless.',
      description: 'Tools for your team and stakeholders to share feedback and iterate faster.',
    },
    {
      icon: Lock,
      title: 'Enterprise grade',
      subtitle: 'security.',
      description: 'Keep your data secure with enterprise-grade security, SOC 2 compliance, and more.',
    },
    {
      icon: BarChart3,
      title: 'Performance',
      subtitle: 'analytics.',
      description: 'Monitor your application performance with real-time analytics and insights.',
    },
  ];

  return (
    <section className="bg-transparent py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-gray-950">
            Everything you need
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-emerald-950 to-emerald-800 bg-clip-text text-transparent">
              to build the web.
            </span>
          </h2>
          <p className="text-lg text-emerald-950/70 font-medium max-w-2xl mx-auto">
            From idea to scale, every tool you need is built in.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 sm:p-12 bg-white/60 backdrop-blur-sm border border-emerald-500/10 rounded-lg hover:border-emerald-500/20 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-lg sm:text-xl text-emerald-900/80 font-semibold mb-4">{feature.subtitle}</p>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Feature */}
        <div className="mt-16 p-8 sm:p-12 bg-white/60 backdrop-blur-sm border border-emerald-500/10 rounded-lg hover:border-emerald-500/20 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mb-6" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-4">Collaborate seamlessly</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                Share your work instantly with your team. Get feedback in real-time and iterate faster than ever before. Built for modern development workflows.
              </p>
            </div>
            <div className="h-64 bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-500/10 flex items-center justify-center shadow-inner">
              <div className="text-center">
                <div className="text-emerald-800 font-semibold">Collaboration Preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


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
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Everything you need
            <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              to build the web.
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
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
                className="group relative p-8 sm:p-12 border border-white/10 rounded-lg hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:text-gray-200 transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-lg sm:text-xl text-gray-400 mb-4">{feature.subtitle}</p>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Feature */}
        <div className="mt-16 p-8 sm:p-12 border border-white/10 rounded-lg hover:border-white/30 hover:bg-white/5 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-6" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Collaborate seamlessly</h3>
              <p className="text-gray-400 leading-relaxed">
                Share your work instantly with your team. Get feedback in real-time and iterate faster than ever before. Built for modern development workflows.
              </p>
            </div>
            <div className="h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400">Collaboration Preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

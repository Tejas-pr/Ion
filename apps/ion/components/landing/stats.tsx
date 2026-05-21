export default function Stats() {
  const stats = [
    {
      stat: '20 days',
      description: 'saved on daily builds.',
      company: 'Netflix',
    },
    {
      stat: '98% faster',
      description: 'time to market.',
      company: 'TripAdvisor',
    },
    {
      stat: '300% increase',
      description: 'in SEO.',
      company: 'Box',
    },
    {
      stat: '6x faster',
      description: 'to build + deploy.',
      company: 'eBay',
    },
  ];

  return (
    <section className="bg-transparent border-y border-emerald-500/10 dark:border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, idx) => (
          <div key={idx} className="space-y-6 border-b sm:border-b-0 sm:border-r border-emerald-500/10 dark:border-white/10 last:border-r-0 sm:last:border-r pb-8 sm:pb-0 sm:pr-8">
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">{item.stat}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium">{item.description}</p>
            </div>
            <p className="text-emerald-900/60 dark:text-emerald-300/60 font-semibold text-lg">{item.company}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



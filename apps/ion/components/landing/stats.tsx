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
    <section className="bg-black border-y border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, idx) => (
          <div key={idx} className="space-y-6 border-b sm:border-b-0 sm:border-r last:border-r-0 sm:last:border-r pb-8 sm:pb-0 sm:pr-8">
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{item.stat}</p>
              <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
            </div>
            <p className="text-gray-500 font-medium text-lg">{item.company}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

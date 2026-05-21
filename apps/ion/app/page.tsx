import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Stats from '@/components/landing/stats';
import Collaboration from '@/components/landing/collaboration';
import Footer from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen text-gray-900 dark:text-gray-100 overflow-x-hidden relative bg-[#f9fdfb] dark:bg-black">
      {/* Gorgeous Full-Page Emerald Glow Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "var(--landing-bg)",
          backgroundAttachment: "fixed",
        }}
      />


      <div className="relative z-10">
        <Hero />
        <Stats />
        <Features />
        <Collaboration />
        <Footer />
      </div>
    </main>
  );
}



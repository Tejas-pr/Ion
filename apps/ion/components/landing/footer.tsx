import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    Products: [
      { label: "Overview", href: "#" },
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Status", href: "#" },
    ],
    Resources: [
      { label: "Docs", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
    Legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-transparent border-t border-emerald-500/10 dark:border-white/10 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section */}
        <div className="mb-16 text-center space-y-4 pb-16 border-b border-emerald-500/10 dark:border-white/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 dark:text-white">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto">
            Join thousands of teams building the web with Ion.
          </p>
          <Link href="/signup" className="inline-block mt-4 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-black dark:hover:bg-neutral-100 transition-colors shadow-md shadow-emerald-950/15 dark:shadow-emerald-500/5">
            Get Started for Free
          </Link>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo Column */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 text-emerald-600 dark:text-emerald-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="font-bold text-black dark:text-white text-xl">Ion</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              The complete platform to build, deploy, and scale the web.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-950 dark:text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-emerald-500/10 dark:border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            © {new Date().getFullYear()} Ion. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white bg-emerald-500/10 dark:bg-white/5 hover:bg-emerald-500/20 dark:hover:bg-white/10 p-2 rounded-full transition-all duration-200"
                  aria-label={link.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}



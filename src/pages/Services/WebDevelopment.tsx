import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function WebDevelopment() {
  const { themeColor } = useThemeHue();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Web Development</h1>

            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Custom web applications and progressive web apps built with modern frontend and backend stacks. We focus on scalable component architectures using React and TypeScript, strict typing and CI pipelines to ensure maintainability, and performance optimisations such as code-splitting, server-side rendering where appropriate, and critical-path rendering improvements to reduce Time-to-Interactive.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8">Core Capabilities:</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/80">
                <li>React & TypeScript architecture and component libraries</li>
                <li>Performance budgets, SSR/SSG and hydration strategies</li>
                <li>Automated testing & CI-driven releases</li>
                <li>Progressive Web Apps and offline-first strategies</li>
              </ul>

              <p>
                Our engineering approach includes automated testing, measurable performance budgets, and observability hooks that allow teams to iterate quickly while keeping production reliability high. We design APIs and data contracts to be stable and versioned, minimising downstream breakage and enabling long-term evolution of your product.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

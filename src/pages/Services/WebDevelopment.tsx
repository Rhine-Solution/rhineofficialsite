import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function WebDevelopment() {
const { themeColor } = useThemeHue();

// Scroll to top when mounted
React.useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);

return (
<Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
<div className="container mx-auto px-6 py-12 text-white">
<h1 className="text-4xl font-bold mb-6">Web Development</h1>
<div className="prose prose-invert max-w-none">
<p>
Custom web applications and progressive web apps built with modern frontend and backend stacks. We focus on
  scalable component architectures using React and TypeScript, strict typing and CI pipelines to ensure maintainability,
            and performance optimisations such as code-splitting, server-side rendering where appropriate, and critical-path
  rendering improvements to reduce Time-to-Interactive.
</p>

<h2>Core Capabilities</h2>
<ul className="space-y-2 text-white/80">
<li>React & TypeScript architecture and component libraries</li>
  <li>Performance budgets, SSR/SSG and hydration strategies</li>
            <li>Automated testing & CI-driven releases</li>
  <li>Progressive Web Apps and offline-first strategies</li>
</ul>

<p>
  Our engineering approach includes automated testing, measurable performance budgets, and observability hooks that
    allow teams to iterate quickly while keeping production reliability high. We design APIs and data contracts to be
      stable and versioned, minimising downstream breakage and enabling long-term evolution of your product.
      </p>
      </div>
      </div>
    </Layout>
  );
}

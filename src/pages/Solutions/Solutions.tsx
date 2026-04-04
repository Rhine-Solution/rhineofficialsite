import React from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import useThemeHue from '../../hooks/useThemeHue';

const items = [
  { title: 'Enterprise Software', to: '/solutions/enterprise-software' },
  { title: 'AI & Automation', to: '/solutions/ai-automation' },
  { title: 'Cybersecurity Suite', to: '/solutions/cybersecurity-suite' },
  { title: 'Data Analytics', to: '/solutions/data-analytics' },
];

export default function Solutions() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Solutions – Purpose-Built Products</h1>
        <div className="prose prose-invert max-w-none mb-8 text-white/80">
          <p>
            Purpose-built products and packaged solutions to accelerate delivery and reduce operational risk. Rhine Solution
            provides configurable platforms and verticalised products that integrate with your existing stack and processes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(i => (
            <Link to={i.to} key={i.to} className="block bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-semibold mb-2">{i.title}</h3>
              <p className="text-white/80">{i.title} to accelerate delivery and reduce operational risk.</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

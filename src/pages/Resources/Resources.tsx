import React from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import useThemeHue from '../../hooks/useThemeHue';

const items = [
  { title: 'Case Studies', to: '/resources/case-studies' },
  { title: 'Documentation', to: '/resources/documentation' },
  { title: 'Blog / Insights', to: '/resources/blog-insights' },
  { title: 'Support & Community', to: '/resources/support-community' },
];

export default function Resources() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Resources</h1>
        <div className="prose prose-invert max-w-none mb-8 text-white/80">
          <p>Documentation, case studies, and community resources to help you adopt and extend our platforms.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(i => (
            <Link to={i.to} key={i.to} className="block bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-semibold mb-2">{i.title}</h3>
              <p className="text-white/80">{i.title} to help you adopt our solutions.</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

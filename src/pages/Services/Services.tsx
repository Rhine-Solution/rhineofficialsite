import React from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import useThemeHue from '../../hooks/useThemeHue';

const items = [
  { title: 'Web Development', to: '/services/web-development' },
  { title: 'Cloud Infrastructure', to: '/services/cloud-infrastructure' },
  { title: 'IT Consulting', to: '/services/it-consulting' },
  { title: 'Digital Transformation', to: '/services/digital-transformation' },
];

export default function Services() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} showAuthButtons={true}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Services – Comprehensive Technology Solutions</h1>
        <div className="prose prose-invert max-w-none mb-8">
          <p>
            At Rhine Solution, we provide engineering-driven services across product, infrastructure, and operations. Our
            teams deliver end-to-end solutions from design to production with an emphasis on reliability, observability, and
            measurable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(i => (
            <Link to={i.to} key={i.to} className="block bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-semibold mb-2">{i.title}</h3>
              <p className="text-white/80">Learn more about our {i.title} services.</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

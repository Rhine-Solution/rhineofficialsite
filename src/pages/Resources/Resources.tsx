import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { Link } from 'react-router-dom';

const resources = [
  {
    id: 'case-studies',
    title: 'Case Studies',
    desc: 'Documented client engagements showing measurable outcomes, architecture patterns, and lessons learned.',
    features: [
      'Global logistics firm - 70% API response time reduction',
      'Healthcare provider - HIPAA compliance & 2,000 staff hours saved',
      'E-commerce - 10x Black Friday traffic with zero downtime',
      'Manufacturing - 45% reduction in unplanned downtime'
    ]
  },
  {
    id: 'documentation',
    title: 'Documentation',
    desc: 'Technical documentation, API references, and onboarding guides for implementers.',
    features: [
      'Getting started guides and API references',
      'SDK documentation (JS, Python, Go, Java)',
      'Architecture blueprints (CloudFormation, Terraform)',
      'Troubleshooting FAQs'
    ]
  },
  {
    id: 'blog-insights',
    title: 'Blog / Insights',
    desc: 'Engineering and product posts on architecture, performance, and case studies.',
    features: [
      'Technical tutorials and how-to guides',
      'Industry trends and best practices',
      'Deep dives from real projects',
      'Guest posts from industry experts'
    ]
  },
  {
    id: 'support-community',
    title: 'Support & Community',
    desc: 'Get help and connect with other developers using our platforms.',
    features: [
      'Community forums and discussions',
      'Technical support channels',
      'Developer resources and tools',
      'Events and meetups'
    ]
  }
];

export default function Resources() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-16 md:py-40 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>Knowledge</h3>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12">Resources</h2>
            <p className="text-white/60 text-lg max-w-2xl mb-16">
              Documentation, case studies, and community resources to help you adopt and extend our platforms.
            </p>
          </div>
        </section>

        {resources.map((resource, i) => (
          <section key={resource.id} id={resource.id} className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 hover:bg-black/90 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
                  <h3 className="text-3xl font-bold text-white uppercase tracking-wider">{resource.title}</h3>
                </div>
                <p className="text-white/70 text-lg mb-8">{resource.desc}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resource.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link to={`/resources/${resource.id}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ color: themeColor }}>
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/60 text-lg mb-8">Need help or want to connect?</p>
            <button
              className="px-8 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em] transition-all hover:shadow-lg"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Join Community
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
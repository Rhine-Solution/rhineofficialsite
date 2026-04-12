import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { Link } from 'react-router-dom';

const solutions = [
  {
    id: 'enterprise-software',
    title: 'Enterprise Software',
    desc: 'End-to-end software delivery for large organisations with observability and compliance.',
    features: [
      'Custom ERP, CRM, SCM, and HRM systems',
      'Microservices architecture with enterprise-grade security',
      'Role-based access and audit logs',
      'API-first design for integrations'
    ]
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    desc: 'Deployable machine learning pipelines, feature stores, and end-to-end automation.',
    features: [
      'Reproducible training pipelines',
      'CI-driven model deployment with drift detection',
      'Explainable AI and cost-efficient inference',
      'Integration with existing data platforms'
    ]
  },
  {
    id: 'cybersecurity-suite',
    title: 'Cybersecurity Suite',
    desc: 'Holistic security controls covering identity, platform hardening, and incident response.',
    features: [
      'SIEM, endpoint detection, and runtime protection',
      'Zero-trust network design',
      'Automated playbooks for incident response',
      'Mean-time-to-detection and remediation'
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    desc: 'Data platforms for reporting, feature engineering stores, and self-service analytics.',
    features: [
      'Reliable ETL and near-real-time streaming',
      'Data lineage and governance',
      'Self-service analytics dashboards',
      'ML-ready data pipelines'
    ]
  }
];

export default function Solutions() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-16 md:py-40 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>Products</h3>
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12">Solutions</h2>
            <p className="text-white/60 text-sm md:text-lg max-w-2xl mb-10 md:mb-16">
              Purpose-built products and packaged solutions to accelerate delivery and reduce operational risk.
            </p>
          </div>
        </section>

        {solutions.map((solution, i) => (
          <section key={solution.id} id={solution.id} className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 hover:bg-black/90 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
                  <h3 className="text-3xl font-bold text-white uppercase tracking-wider">{solution.title}</h3>
                </div>
                <p className="text-white/70 text-lg mb-8">{solution.desc}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {solution.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link to={`/solutions/${solution.id}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ color: themeColor }}>
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
            <p className="text-white/60 text-lg mb-8">Need a custom solution?</p>
            <button
              className="px-8 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em] transition-all hover:shadow-lg"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'web-development',
    title: 'Web Development',
    desc: 'Custom web applications and progressive web apps built with modern frontend and backend stacks.',
    features: [
      'React & TypeScript architecture and component libraries',
      'Performance budgets, SSR/SSG and hydration strategies',
      'Automated testing & CI-driven releases',
      'Progressive Web Apps and offline-first strategies'
    ]
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    desc: 'Designing scalable, secure cloud platforms using Infrastructure-as-Code, automated deployments, and observability.',
    features: [
      'Infrastructure as Code with policy gates and drift detection',
      'Observability stacks: tracing, metrics, and structured logs',
      'Automated blue/green and canary deployments',
      'Cost optimisations and rightsizing guidance'
    ]
  },
  {
    id: 'it-consulting',
    title: 'IT Consulting',
    desc: 'Enterprise technology strategy, vendor evaluation, and delivery governance.',
    features: [
      'Technical due diligence and vendor evaluation',
      'Roadmap alignment and delivery governance',
      'Organisation design for platform teams',
      'Cost vs value analysis and migration planning'
    ]
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    desc: 'Accelerating business outcomes through product thinking, automation, and data-driven decisions.',
    features: [
      'Process redesign and automation',
      'Platform consolidation and cloud migration',
      'Data foundations for measurement and ML',
      'Change management and operational enablement'
    ]
  }
];

export default function Services() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-16 md:py-40 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>What We Do</h3>
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12">Services</h2>
            <p className="text-white/60 text-sm md:text-lg max-w-2xl mb-10 md:mb-16">
              Engineering-driven services across product, infrastructure, and operations. 
              Our teams deliver end-to-end solutions from design to production.
            </p>
          </div>
        </section>

        {services.map((service, i) => (
          <section key={service.id} id={service.id} className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 hover:bg-black/90 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
                  <h3 className="text-3xl font-bold text-white uppercase tracking-wider">{service.title}</h3>
                </div>
                <p className="text-white/70 text-lg mb-8">{service.desc}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link to={`/services/${service.id}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ color: themeColor }}>
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
            <p className="text-white/60 text-lg mb-8">Ready to start your project?</p>
            <button
              className="px-8 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em] transition-all hover:shadow-lg"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Start Project
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
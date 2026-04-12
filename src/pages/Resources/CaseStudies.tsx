import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function CaseStudies() {
  const { themeColor } = useThemeHue();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <a href="/resources" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Back to Resources
            </a>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Resource</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">Case Studies</h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Documented client engagements showing measurable outcomes, architecture patterns, and lessons learned.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Recent Projects</h2>
              <ul className="space-y-6">
                <li className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Global Logistics Firm</h3>
                  <p className="text-white/60 mb-2">Reduced API response times by 70% using edge computing</p>
                  <span className="text-sm" style={{ color: themeColor }}>Technology: Edge Computing, Microservices</span>
                </li>
                <li className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Healthcare Provider</h3>
                  <p className="text-white/60 mb-2">Achieved HIPAA compliance and automated patient data ingestion</p>
                  <p className="text-white/50 text-sm">Saved 2,000 staff hours annually</p>
                </li>
                <li className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">E-commerce Brand</h3>
                  <p className="text-white/60 mb-2">Migrated to cloud-native architecture</p>
                  <p className="text-white/50 text-sm">Handled 10x Black Friday traffic with zero downtime</p>
                </li>
                <li>
                  <h3 className="text-xl font-bold text-white mb-2">Manufacturing Company</h3>
                  <p className="text-white/60 mb-2">Deployed IoT predictive maintenance</p>
                  <p className="text-white/50 text-sm">Cut unplanned downtime by 45%</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
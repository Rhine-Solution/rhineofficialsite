import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function ITConsulting() {
  const { themeColor } = useThemeHue();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <a href="/services" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Back to Services
            </a>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Service</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">IT Consulting</h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Enterprise technology strategy, vendor evaluation, and delivery governance. We align engineering 
              roadmaps with business objectives and provide pragmatic vendor selection and integration guidance.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Approach</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Technical Due Diligence</strong>
                    <span className="text-white/60">Vendor evaluation and technology assessment</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Roadmap Alignment</strong>
                    <span className="text-white/60">Delivery governance and milestone tracking</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Organisation Design</strong>
                    <span className="text-white/60">Platform team structures and roles</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Cost Analysis</strong>
                    <span className="text-white/60">Value vs cost comparison and migration planning</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Why Us</h2>
              <p className="text-white/70">
                Our consultants emphasise measurable KPIs, governance frameworks, and cross-functional delivery 
                processes to ensure predictable outcomes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
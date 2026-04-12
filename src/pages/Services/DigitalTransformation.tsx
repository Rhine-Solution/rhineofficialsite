import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function DigitalTransformation() {
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
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">Digital Transformation</h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Accelerating business outcomes through product thinking, automation, and data-driven decisions. 
              We help teams adopt modern delivery practices, automate repetitive workflows, and build 
              product-oriented roadmaps that deliver measurable value.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">What We Deliver</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Process Redesign</strong>
                    <span className="text-white/60">Workflow automation and optimization</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Platform Consolidation</strong>
                    <span className="text-white/60">Cloud migration and modernization</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Data Foundations</strong>
                    <span className="text-white/60">Measurement infrastructure and ML readiness</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Change Management</strong>
                    <span className="text-white/60">Operational enablement and training</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Our Approach</h2>
              <p className="text-white/70">
                Work includes process redesign, platform consolidation, and building data foundations 
                to enable continuous improvement.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function WebGPU3D() {
  const { themeColor } = useThemeHue();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <a href="/technology" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Back to Technology
            </a>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Technology</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">WebGPU / 3D Rendering</h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Browser-based GPU rendering workflows and interactive 3D visualisations using WebGPU 
              and optimised shader pipelines.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">What We Do</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Optimised Shader Pipelines</strong>
                    <span className="text-white/60">High-performance GPU rendering</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Memory Optimization</strong>
                    <span className="text-white/60">Efficient resource management</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Progressive Loading</strong>
                    <span className="text-white/60">Optimized for lower-end devices</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <strong className="text-white block mb-1">Interactive Visualizations</strong>
                    <span className="text-white/60">Product demos and data visualisation</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Use Cases</h2>
              <p className="text-white/70">
                Interactive product demos, data visualisation, and complex material rendering for 
                web-native experiences that push the boundaries of what's possible in the browser.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
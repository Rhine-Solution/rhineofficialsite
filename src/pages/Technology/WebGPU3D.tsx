import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function WebGPU3D() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">WebGPU / 3D Rendering</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Browser-based GPU rendering workflows and interactive 3D visualisations using WebGPU and optimised shader pipelines. We build performant scenes with attention to memory usage, GPU scheduling, and progressive loading for lower-end devices. Use cases include interactive product demos, data visualisation, and complex material rendering for web-native experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

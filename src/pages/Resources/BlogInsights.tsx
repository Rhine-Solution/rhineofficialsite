import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function BlogInsights() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Blog / Insights</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>Engineering and product posts on architecture, performance, and case studies. Learnings and deep dives from real projects and experiments.</p>
              <p>Weekly articles cover technical tutorials ("How to build a RAG chatbot with Llama 3", "Optimising WebGPU render pipelines"), industry trends, best practices, and guest posts.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

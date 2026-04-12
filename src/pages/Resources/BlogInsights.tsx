import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function BlogInsights() {
  const { themeColor } = useThemeHue();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const posts = [
    { title: 'How to build a RAG chatbot with Llama 3', category: 'Tutorial' },
    { title: 'Optimising WebGPU render pipelines', category: 'Performance' },
    { title: 'The future of edge computing', category: 'Trends' },
    { title: 'Building scalable microservices', category: 'Architecture' },
  ];

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
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">Blog / Insights</h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Engineering and product posts on architecture, performance, and case studies.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Latest Articles</h2>
              <ul className="space-y-4">
                {posts.map((post, i) => (
                  <li key={i} className="flex items-center justify-between py-4 border-b border-white/10">
                    <span className="text-white text-lg">{post.title}</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/60" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                      {post.category}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
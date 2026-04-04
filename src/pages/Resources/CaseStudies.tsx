import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function CaseStudies() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Case Studies</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Documented client engagements showing measurable outcomes, architecture patterns, and lessons learned. Case studies present the problem, the technical approach, and quantified results to help stakeholders evaluate fit. Where applicable, architecture diagrams and cost breakdowns are provided to make trade-offs explicit.
              </p>
              <p>
                Recent examples: Global logistics firm – reduced API response times by 70% using edge computing; Healthcare provider – achieved HIPAA compliance and automated patient data ingestion, saving 2,000 staff hours annually; E‑commerce brand – migrated to cloud‑native architecture, handling 10x Black Friday traffic with zero downtime; Manufacturing company – deployed IoT predictive maintenance, cutting unplanned downtime by 45%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

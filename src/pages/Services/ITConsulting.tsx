import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function ITConsulting() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">IT Consulting</h1>

            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Enterprise technology strategy, vendor evaluation, and delivery governance. We align engineering roadmaps with business objectives and provide pragmatic vendor selection and integration guidance.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8">Approach:</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/80">
                <li>Technical due diligence and vendor evaluation</li>
                <li>Roadmap alignment and delivery governance</li>
                <li>Organisation design for platform teams</li>
                <li>Cost vs value analysis and migration planning</li>
              </ul>

              <p>
                Our consultants emphasise measurable KPIs, governance frameworks, and cross-functional delivery processes to ensure predictable outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

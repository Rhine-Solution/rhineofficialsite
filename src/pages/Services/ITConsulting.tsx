import React from 'react';
import Layout from '../../components/Layout';

export default function ITConsulting() {
  return (
    <Layout themeColor="#4f46e5" showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">IT Consulting</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Enterprise technology strategy, vendor evaluation, and delivery governance. We align engineering roadmaps with
            business objectives and provide pragmatic vendor selection and integration guidance.
          </p>

          <h2>Approach</h2>
          <ul className="space-y-2 text-white/80">
            <li>Technical due diligence and vendor evaluation</li>
            <li>Roadmap alignment and delivery governance</li>
            <li>Organisation design for platform teams</li>
            <li>Cost vs value analysis and migration planning</li>
          </ul>

          <p>
            Our consultants emphasise measurable KPIs, governance frameworks, and cross-functional delivery processes to ensure
            predictable outcomes.
          </p>
        </div>
      </div>
    </Layout>
  );
}

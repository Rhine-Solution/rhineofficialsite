import React from 'react';
import Layout from '../../components/Layout';

export default function DigitalTransformation() {
  return (
    <Layout themeColor="#4f46e5" showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Digital Transformation</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Accelerating business outcomes through product thinking, automation, and data-driven decisions. We help teams adopt
            modern delivery practices, automate repetitive workflows, and build product-oriented roadmaps that deliver measurable value.
          </p>

          <h2>What we deliver</h2>
          <ul className="space-y-2 text-white/80">
            <li>Process redesign and automation</li>
            <li>Platform consolidation and cloud migration</li>
            <li>Data foundations for measurement and ML</li>
            <li>Change management and operational enablement</li>
          </ul>

          <p>
            Work includes process redesign, platform consolidation, and building data foundations to enable continuous improvement.
          </p>
        </div>
      </div>
    </Layout>
  );
}

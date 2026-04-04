import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function DigitalTransformation() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Digital Transformation</h1>

            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Accelerating business outcomes through product thinking, automation, and data-driven decisions. We help teams adopt modern delivery practices, automate repetitive workflows, and build product-oriented roadmaps that deliver measurable value.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8">What we deliver:</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/80">
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
        </div>
      </div>
    </Layout>
  );
}

import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function AIAutomation() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">AI & Automation</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Deployable machine learning pipelines, feature stores, and end-to-end automation that reduces manual effort and accelerates decision-making. We build reproducible training pipelines, CI-driven model deployment, and monitoring that includes drift detection and automated rollback strategies.
              </p>
              <p>
                Focused on operationalising ML, our solutions emphasise explainability, cost-efficient inference, and integration with existing data platforms while ensuring access control and auditability for regulated environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

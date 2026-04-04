import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function DataAnalytics() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Data Analytics</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Data platforms for reporting, feature engineering stores, and self-service analytics. We design pipelines for reliable ETL, near-real-time streaming, and aggregated views that power dashboards and ML models.
              </p>
              <p>
                Emphasis is placed on data lineage, governance, and performance to ensure trust in insights and to support reproducible analyses across teams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

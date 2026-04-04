import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function EnterpriseSoftware() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Enterprise Software</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                End-to-end software delivery for large organisations with observability and compliance. Custom ERP, CRM, SCM, and HRM systems built on microservices architecture with enterprise-grade security. Off-the-shelf software often forces you to adapt your processes.
              </p>
              <p>
                Rhine Solution’s enterprise software solutions are custom-built to match your unique workflows. We deliver systems integrating finance, procurement, inventory, production, sales automation, support ticketing, real-time logistics tracking, payroll, recruitment, and performance reviews. All solutions feature role-based access, audit logs, and API-first design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

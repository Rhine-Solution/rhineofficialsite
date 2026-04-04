import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function CloudInfrastructure() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Cloud Infrastructure</h1>

            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Designing scalable, secure cloud platforms using Infrastructure-as-Code, automated deployments, and observability best practices. We design for fault tolerance, cost efficiency, and clear deployment pipelines with immutable infrastructure patterns.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8">Capabilities:</h2>
              <ul className="list-disc pl-6 space-y-2 text-white/80">
                <li>Infrastructure as Code with policy gates and drift detection</li>
                <li>Observability stacks: tracing, metrics, and structured logs</li>
                <li>Automated blue/green and canary deployments</li>
                <li>Cost optimisations and rightsizing guidance</li>
              </ul>

              <p>
                Our offering includes security posture management, IaC policy as code, and automated recovery playbooks to minimise downtime and blast radius.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

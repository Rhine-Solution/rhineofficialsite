import React from 'react';
import Layout from '../../components/Layout';

export default function CloudInfrastructure() {
  return (
    <Layout themeColor="#4f46e5" showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Cloud Infrastructure</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Designing scalable, secure cloud platforms using Infrastructure-as-Code, automated deployments, and observability
            best practices. We design for fault tolerance, cost efficiency, and clear deployment pipelines with immutable
            infrastructure patterns.
          </p>

          <h2>Capabilities</h2>
          <ul className="space-y-2 text-white/80">
            <li>Infrastructure as Code with policy gates and drift detection</li>
            <li>Observability stacks: tracing, metrics, and structured logs</li>
            <li>Automated blue/green and canary deployments</li>
            <li>Cost optimisations and rightsizing guidance</li>
          </ul>

          <p>
            Our offering includes security posture management, IaC policy as code, and automated recovery playbooks to minimize
            downtime and blast radius.
          </p>
        </div>
      </div>
    </Layout>
  );
}

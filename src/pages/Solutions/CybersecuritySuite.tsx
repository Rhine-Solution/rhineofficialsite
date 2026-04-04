import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function CybersecuritySuite() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Cybersecurity Suite</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Holistic security controls covering identity, platform hardening, continuous threat detection, and incident response. We integrate SIEM, endpoint detection, and runtime protection to reduce mean-time-to-detection and mean-time-to-remediation.
              </p>
              <p>
                Our approach emphasises least-privilege, zero-trust network design, and automated playbooks to contain and recover from incidents while maintaining business continuity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

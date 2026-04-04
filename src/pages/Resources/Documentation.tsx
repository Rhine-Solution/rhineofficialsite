import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function Documentation() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Documentation</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                Technical documentation, API references, and onboarding guides for implementers. Documentation is structured for both integrators and product teams, with examples, SDK references, and practical runbooks.
              </p>
              <p>
                We keep docs versioned alongside code and expose changelogs to make upgrades predictable. Includes getting started guides, API reference with request/response examples, SDK documentation (JavaScript, Python, Go, Java), CLI tool manuals, architecture blueprints (AWS CloudFormation, Terraform modules), and troubleshooting FAQs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

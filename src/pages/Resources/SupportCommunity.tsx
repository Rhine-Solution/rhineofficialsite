import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';

export default function SupportCommunity() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true}>
      <div className="py-20 px-6 md:px-10">
        <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 relative z-10 hover:bg-black/90 transition-all duration-300">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Support & Community</h1>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>Community forums, support contacts, and SLA details. Access help articles, raise tickets, or join our community channels to collaborate with other users and engineers.</p>
              <p>Choose the support level that fits your business: Community support (public forum, knowledge base); Standard support – 8/5 email and chat with 24-hour response; Premium support – 24/7 phone, chat, and email with 2-hour SLA; Enterprise support – dedicated technical account manager, on-site visits, and architecture reviews.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

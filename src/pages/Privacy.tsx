import React from 'react';
import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout showAuthButtons={true}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-white/80">
          <p>Rhine Solution ("we", "us", "our") values your privacy. This Privacy Policy explains how we collect, use, and disclose information when you use our website and services.</p>
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly, such as account details, and automatically collected data like usage metrics and cookies.</p>
          <h2>How We Use Information</h2>
          <p>We use information to provide and improve services, communicate with users, and for security and analytics purposes.</p>
          <h2>Sharing and Disclosure</h2>
          <p>We do not sell personal data. We may share data with service providers and as required by law.</p>
          <h2>Security</h2>
          <p>We implement reasonable measures to protect data, but no system is completely secure.</p>
          <h2>Contact</h2>
          <p>Contact us at privacy@rhinesolution.example for questions.</p>
        </div>
      </div>
    </Layout>
  );
}

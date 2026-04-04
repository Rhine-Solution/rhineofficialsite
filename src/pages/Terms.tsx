import React from 'react';
import Layout from '../components/Layout';

export default function Terms() {
  return (
    <Layout showAuthButtons={true}>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-white/80">
          <p>These Terms of Service govern your use of Rhine Solution's website and services. By using the site you agree to these terms.</p>
          <h2>Use of Service</h2>
          <p>You must comply with all applicable laws and not misuse the service.</p>
          <h2>Intellectual Property</h2>
          <p>All intellectual property rights remain with Rhine Solution or its licensors.</p>
          <h2>Limitation of Liability</h2>
          <p>We are not liable for indirect damages. Our aggregate liability is limited to the fees paid by you, if any.</p>
          <h2>Governing Law</h2>
          <p>These terms are governed by applicable law where Rhine Solution operates.</p>
        </div>
      </div>
    </Layout>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-24 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">404 — Page not found</h1>
        <p className="text-white/70 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-block bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl px-6 py-3 text-white hover:scale-105 transition-transform">Return home</Link>
      </div>
    </Layout>
  );
}

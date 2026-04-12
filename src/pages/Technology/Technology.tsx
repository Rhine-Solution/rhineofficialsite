import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { Link } from 'react-router-dom';

const technologies = [
  {
    id: 'webgpu-3d',
    title: 'WebGPU / 3D Rendering',
    desc: 'Browser-based GPU rendering workflows and interactive 3D visualisations using WebGPU.',
    features: [
      'Optimised shader pipelines',
      'Memory usage and GPU scheduling optimization',
      'Progressive loading for lower-end devices',
      'Interactive product demos and data visualisation'
    ]
  },
  {
    id: 'blockchain-web3',
    title: 'Blockchain / Web3',
    desc: 'Smart contracts, permissioning models, and secure on-chain integrations.',
    features: [
      'Audit-friendly contract architectures',
      'Secure key management and off-chain oracles',
      'Interoperability layers for enterprise workflows',
      'Rigorous CI for vulnerability prevention'
    ]
  },
  {
    id: 'iot-edge',
    title: 'IoT & Edge Computing',
    desc: 'Edge-native architectures for device management, secure telemetry, and low-latency processing.',
    features: [
      'Device lifecycle management',
      'Secure OTA updates with integrity verification',
      'Remote diagnostics and telemetry pipelines',
      'Bandwidth-optimized observability'
    ]
  },
  {
    id: 'custom-apis',
    title: 'Custom APIs',
    desc: 'Designing secure, versioned APIs with best-practice authentication and clear versioning policies.',
    features: [
      'OpenAPI-compliant contracts',
      'Automated contract tests',
      'Robust error handling and observability',
      'Schema validation for data integrity'
    ]
  }
];

export default function Technology() {
  const { themeColor } = useThemeHue();

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-16 md:py-40 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>Capabilities</h3>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12">Technology</h2>
            <p className="text-white/60 text-lg max-w-2xl mb-16">
              Cutting-edge technologies to deliver next-generation digital experiences.
            </p>
          </div>
        </section>

        {technologies.map((tech, i) => (
          <section key={tech.id} id={tech.id} className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12 hover:bg-black/90 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
                  <h3 className="text-3xl font-bold text-white uppercase tracking-wider">{tech.title}</h3>
                </div>
                <p className="text-white/70 text-lg mb-8">{tech.desc}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tech.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link to={`/technology/${tech.id}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ color: themeColor }}>
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/60 text-lg mb-8">Explore our technology capabilities?</p>
            <button
              className="px-8 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em] transition-all hover:shadow-lg"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Get in Touch
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
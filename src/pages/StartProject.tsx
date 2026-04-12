import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet-async';

const terminalLines = [
  { text: 'Initializing Rhine Project Interface...', delay: 0 },
  { text: 'Loading system modules...', delay: 800 },
  { text: 'Connecting to project database...', delay: 1600 },
  { text: 'Setting up workspace environment...', delay: 2400 },
  { text: 'Configuring user permissions...', delay: 3200 },
  { text: 'Preparing project templates...', delay: 4000 },
  { text: 'System ready. Redirecting...', delay: 4800 },
];

export default function StartProject() {
  const [lines, setLines] = useState<string[]>([]);
  const [completedLines, setCompletedLines] = useState<number>(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    terminalLines.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, line.text]);
        setCompletedLines(index + 1);
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Start Project | Rhine Solution</title>
        <meta name="description" content="Start a new project with Rhine Solution - Innovation at the edge" />
      </Helmet>
      <Layout themeColor="#4f46e5" showAuthButtons disableSideMenu>
        <div className="min-h-screen pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-white/40 font-mono">rhine-project ~</span>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-white/40 mb-4">$ init-project --rhine</div>
                {lines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">{line}</span>
                  </div>
                ))}
                {completedLines < terminalLines.length && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">›</span>
                    <span className="text-white/40 animate-pulse">_</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
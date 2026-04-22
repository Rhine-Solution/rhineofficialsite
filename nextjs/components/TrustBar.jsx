'use client';

import { Shield, Clock, CheckCircle, Users } from 'lucide-react';

const stats = [
  { icon: Users, text: '50+ Businesses Worldwide', color: 'text-indigo-500' },
  { icon: Shield, text: '99.9% Uptime', color: 'text-green-500' },
  { icon: Clock, text: '24/7 Support', color: 'text-amber-500' },
  { icon: CheckCircle, text: '100+ Projects Delivered', color: 'text-cyan-500' },
];

export default function TrustBar() {
  return (
    <div className="py-8 bg-gray-50 dark:bg-zinc-800/50 border-y border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - main trust message */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              Trusted by 50+ businesses worldwide
            </span>
          </div>

          {/* Right side - stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {stats.slice(1).map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs md:text-sm text-gray-600 dark:text-zinc-400">
                  {stat.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

export default function StatCard({ title, value, icon: Icon, change, changeLabel, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    purple: 'from-purple-500 to-purple-600',
  }

  const iconBgClasses = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    green: 'bg-green-500/20 text-green-400',
    amber: 'bg-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/20 text-rose-400',
    purple: 'bg-purple-500/20 text-purple-400',
  }

  const isPositive = change && change > 0

  return (
    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-white/5 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-zinc-400">{title}</p>
        {changeLabel && (
          <p className="text-xs text-gray-400 dark:text-zinc-500">{changeLabel}</p>
        )}
      </div>
    </div>
  )
}
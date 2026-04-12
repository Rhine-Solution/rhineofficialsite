import { LucideIcon } from 'lucide-react';

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  themeColor?: string;
}

export default function ValueCard({ icon: Icon, title, description, themeColor = '#0082D8' }: ValueCardProps) {
  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 md:p-8 hover:bg-black/90 hover:border-white/20 transition-all duration-300 group">
      <div className="w-14 h-14 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/30 transition-colors">
        <Icon className="w-7 h-7" style={{ color: themeColor }} />
      </div>
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
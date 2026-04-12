import { MessageCircle } from 'lucide-react';
import { githubIcon, twitterIcon } from './GFX';

interface SocialLink {
  name: string;
  url: string;
  icon: 'github' | 'twitter' | 'discord';
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Rhine-Solution',
    icon: 'github',
    label: 'GitHub'
  },
  {
    name: 'X',
    url: 'https://x.com/RhineSolution',
    icon: 'twitter',
    label: 'X (Twitter)'
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/WEwGppRN8K',
    icon: 'discord',
    label: 'Discord'
  }
];

export default function SocialSidebar({ themeColor = '#0082D8' }: { themeColor?: string }) {
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'github':
        return <span className="w-5 h-5 text-white/60 group-hover:text-white transition-colors">{githubIcon()}</span>;
      case 'twitter':
        return <span className="w-5 h-5 text-white/60 group-hover:text-white transition-colors">{twitterIcon()}</span>;
      case 'discord':
        return <MessageCircle className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed left-4 md:left-6 bottom-24 md:bottom-28 z-50 hidden md:block">
      <div className="flex items-center gap-3">
        {/* Social Icons */}
        <div className="flex flex-col gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110"
              style={{ 
                boxShadow: '0 0 20px rgba(0,0,0,0.5)' 
              }}
              aria-label={social.label}
            >
              {renderIcon(social.icon)}
              
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-3 py-1 bg-black/90 backdrop-blur-xl text-white text-xs uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                {social.label}
              </span>
            </a>
          ))}
        </div>
        
        {/* Vertical Line */}
        <div 
          className="w-[1px] h-16 bg-white/20 rounded-full"
          style={{ backgroundColor: `${themeColor}40` }}
        />
      </div>
    </div>
  );
}
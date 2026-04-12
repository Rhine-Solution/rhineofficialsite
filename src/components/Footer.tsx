import React from 'react';
import { Link } from 'react-router-dom';
import { githubIcon, twitterIcon } from './GFX';
import { MessageCircle, Link2 } from 'lucide-react';

type Props = {
  themeColor?: string;
};

type SocialItem = {
  name: string;
  url: string;
  icon: 'github' | 'twitter' | 'discord' | 'linkedin';
  label: string;
};

const socialLinks: SocialItem[] = [
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
    label: 'X'
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/WEwGppRN8K',
    icon: 'discord',
    label: 'Discord'
  },
  {
    name: 'LinkedIn',
    url: '#',
    icon: 'linkedin',
    label: 'LinkedIn'
  }
];

const renderIcon = (iconType: string) => {
  switch (iconType) {
    case 'github':
      return <span className="w-4 h-4">{githubIcon()}</span>;
    case 'twitter':
      return <span className="w-4 h-4">{twitterIcon()}</span>;
    case 'discord':
      return <MessageCircle className="w-4 h-4" />;
    case 'linkedin':
      return <Link2 className="w-4 h-4" />;
    default:
      return null;
  }
};

const footerLinks = {
  company: [
    { name: 'About', url: '/about' },
    { name: 'Services', url: '/services' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Contact', url: '/contact' }
  ],
  resources: [
    { name: 'Case Studies', url: '/resources/case-studies' },
    { name: 'Documentation', url: '/resources/documentation' },
    { name: 'Blog', url: '/resources/blog-insights' },
    { name: 'Community', url: '/resources/support-community' }
  ],
  legal: [
    { name: 'Privacy', url: '/privacy' },
    { name: 'Terms', url: '/terms' }
  ]
};

export default function Footer({ themeColor = '#4f46e5' }: Props) {
  const year = new Date().getFullYear();
  
  return (
    <footer className="relative z-10 bg-black/90 backdrop-blur-xl border-t border-white/10">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-white font-semibold text-lg">Rhine Solution</span>
            </div>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Building innovative digital solutions that transform businesses and push the boundaries of web technology.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  {renderIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.url} className="text-white/50 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.url} className="text-white/50 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.url} className="text-white/50 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-10 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div 
                className="status-dot w-2 h-2 rounded-full" 
                style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }} 
              />
              <div className="text-white/50 text-sm">
                © {year} Rhine Solution. All rights reserved.
              </div>
            </div>
            <div className="text-white/30 text-xs">
              Powered by innovation
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
interface PortfolioCardProps {
  title: string;
  category: string;
  description?: string;
  thumbnail?: string;
  slug: string;
  technologies?: string[];
  themeColor?: string;
}

export default function PortfolioCard({ 
  title, 
  category, 
  description, 
  thumbnail, 
  slug,
  technologies = [],
  themeColor = '#0082D8'
}: PortfolioCardProps) {
  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:bg-black/90 hover:border-white/20 transition-all duration-300 group cursor-pointer">
      {/* Thumbnail */}
      <div className="aspect-[16/10] overflow-hidden relative">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-black/60 to-black/40 flex items-center justify-center">
            <span className="text-5xl font-bold text-white/20 uppercase">{title.charAt(0)}</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-sm bg-black/60 backdrop-blur-sm text-white/80 border border-white/10">
            {category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2 group-hover:transition-colors" style={{ color: themeColor }}>
          {title}
        </h3>
        {description && <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-4">{description}</p>}
        
        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            {technologies.slice(0, 4).map((tech, index) => (
              <span key={index} className="text-xs text-white/40 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        )}
        
        {/* View Link */}
        <div className="mt-4">
          <span className="inline-flex items-center text-sm uppercase tracking-widest transition-colors" style={{ color: themeColor }}>
            View Project
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
interface TeamCardProps {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  themeColor?: string;
}

export default function TeamCard({ name, role, bio, image, linkedin, twitter, themeColor = '#0082D8' }: TeamCardProps) {
  return (
    <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8 hover:bg-black/90 transition-all duration-300 hover:border-white/30">
      <div className="flex items-start gap-6">
        {image ? (
          <div className="avatar flex-shrink-0">
            <div className="w-20 h-20 rounded-full ring ring-white/20">
              <img src={image} alt={name} />
            </div>
          </div>
        ) : (
          <div className="avatar placeholder flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-black/60 ring ring-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-white/80">{name.charAt(0)}</span>
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-white uppercase tracking-wider">{name}</h3>
          <p className="text-sm uppercase tracking-widest mt-1 mb-3" style={{ color: themeColor }}>{role}</p>
          {bio && <p className="text-white/60 text-sm leading-relaxed">{bio}</p>}
          {(linkedin || twitter) && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-wider">
                  LinkedIn
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-wider">
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
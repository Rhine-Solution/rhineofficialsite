interface FilterButtonsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  themeColor?: string;
}

export default function FilterButtons({ categories, activeCategory, onCategoryChange, themeColor = '#0082D8' }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 border ${
            activeCategory === category
              ? 'border-white/80 bg-white/10 text-white shadow-lg'
              : 'border-white/10 bg-black/40 text-white/50 hover:border-white/30 hover:bg-black/60 hover:text-white/80'
          }`}
          style={activeCategory === category ? { borderColor: themeColor, boxShadow: `0 0 20px ${themeColor}20` } : {}}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
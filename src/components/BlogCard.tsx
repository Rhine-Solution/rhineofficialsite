import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  featured?: boolean;
}

export default function BlogCard({
  title,
  excerpt,
  image,
  category,
  date,
  readTime,
  slug,
  featured = false,
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (featured) {
    return (
      <Link
        to={`/resources/blog/${slug}`}
        className="group block relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-lg"
        style={{ boxShadow: isHovered ? '0 0 30px rgba(0, 130, 216, 0.2)' : 'none' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {image && (
            <div className="relative h-48 md:h-full overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
            </div>
          )}
          <div className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-brand-primary/20 text-brand-primary">
                {category}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-white/60 mb-4 line-clamp-3">
              {excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4 text-white/40 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readTime}
                </span>
              </div>
              <ArrowRight className={`w-5 h-5 text-brand-primary transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/resources/blog/${slug}`}
      className="group block bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-lg"
      style={{ boxShadow: isHovered ? '0 0 20px rgba(0, 130, 216, 0.15)' : 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-brand-primary/80 text-white">
              {category}
            </span>
          </div>
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          </div>
          <ArrowRight className={`w-4 h-4 text-brand-primary transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        </div>
      </div>
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      <div className="h-48 bg-white/5 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-white/5 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
        <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-white/5 rounded animate-pulse w-1/3" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function BlogListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
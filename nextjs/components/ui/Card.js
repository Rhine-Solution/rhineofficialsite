export default function Card({ children, className = '', hover = true, ...props }) {
  const baseStyles = 'bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden'
  const hoverStyles = hover ? 'transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10' : ''
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardImage({ src, alt, className = '' }) {
  return (
    <div className={`aspect-video bg-zinc-800 flex items-center justify-center ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-4xl">📦</span>
      )}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-zinc-400 mt-1 ${className}`}>
      {children}
    </p>
  )
}

export function CardPrice({ children, className = '' }) {
  return (
    <div className={`text-xl font-bold text-cyan-400 mt-3 ${className}`}>
      {children}
    </div>
  )
}
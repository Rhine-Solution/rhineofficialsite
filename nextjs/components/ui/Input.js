export default function Input({ 
  label,
  error,
  className = '',
  ...props 
}) {
  const inputStyles = 'w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors'
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <input 
        className={`${inputStyles} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export function Textarea({ 
  label,
  error,
  className = '',
  rows = 4,
  ...props 
}) {
  const inputStyles = 'w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none'
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <textarea 
        className={`${inputStyles} ${error ? 'border-red-500' : ''}`}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export function Select({ 
  label,
  error,
  options = [],
  className = '',
  ...props 
}) {
  const inputStyles = 'w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors'
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <select 
        className={`${inputStyles} ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
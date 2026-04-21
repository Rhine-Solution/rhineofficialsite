'use client'

const statusConfig = {
  // Order statuses
  pending: { label: 'Pending', color: 'amber', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  processing: { label: 'Processing', color: 'blue', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  completed: { label: 'Completed', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400' },
  cancelled: { label: 'Cancelled', color: 'red', bg: 'bg-red-500/20', text: 'text-red-400' },
  refunded: { label: 'Refunded', color: 'gray', bg: 'bg-zinc-500/20', text: 'text-zinc-400' },
  
  // Booking statuses
  confirmed: { label: 'Confirmed', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400' },
  
  // Contact statuses
  read: { label: 'Read', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400' },
  unread: { label: 'Unread', color: 'amber', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  
  // Product stock
  'in stock': { label: 'In Stock', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400' },
  'out of stock': { label: 'Out of Stock', color: 'red', bg: 'bg-red-500/20', text: 'text-red-400' },
  'low stock': { label: 'Low Stock', color: 'amber', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  
  // User roles
  admin: { label: 'Admin', color: 'rose', bg: 'bg-rose-500/20', text: 'text-rose-400' },
  user: { label: 'User', color: 'blue', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  employee: { label: 'Employee', color: 'purple', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  
  // Generic
  active: { label: 'Active', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400' },
  inactive: { label: 'Inactive', color: 'gray', bg: 'bg-zinc-500/20', text: 'text-zinc-400' },
}

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status?.toLowerCase()] || { 
    label: status || 'Unknown', 
    color: 'gray', 
    bg: 'bg-zinc-500/20', 
    text: 'text-zinc-400' 
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${config.bg} ${config.text}
      ${sizeClasses[size]}
    `}>
      {config.label}
    </span>
  )
}
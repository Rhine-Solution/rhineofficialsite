'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from './AuthProvider';
import { Send, MessageCircle, AlertCircle } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'

export default function BlogComments({ postSlug }) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_comments?post_slug=eq.${postSlug}&order=created_at.desc`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          }
        }
      )
      const data = await res.json()
      setComments(data || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    if (!isAuthenticated) {
      setError('Please sign in to comment')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_comments`,
        {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            post_slug: postSlug,
            user_id: user?.id,
            user_name: user?.email?.split('@')[0] || 'Anonymous',
            user_avatar: user?.user_metadata?.avatar_url || null,
            content: newComment.trim()
          })
        }
      )

      if (!res.ok) throw new Error('Failed to submit comment')

      const data = await res.json()
      setComments([data[0], ...comments])
      setNewComment('')
      setSuccess('Comment posted!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-zinc-500">
        Loading comments...
      </div>
    )
  }

  return (
    <div className="mt-16 pt-8 border-t border-zinc-800">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {user?.email?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                {error && (
                  <span className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </span>
                )}
                {success && (
                  <span className="text-green-400 text-sm">{success}</span>
                )}
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <p className="text-zinc-400 mb-3">Sign in to join the discussion</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </a>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-zinc-500 text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {comment.user_avatar ? (
                <img 
                  src={comment.user_avatar} 
                  alt={comment.user_name} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-medium">
                  {comment.user_name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{comment.user_name}</span>
                  <span className="text-zinc-500 text-sm">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-zinc-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
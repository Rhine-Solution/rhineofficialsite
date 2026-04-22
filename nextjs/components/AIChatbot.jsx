'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { getResponseWithDelay, getSuggestedQuestions } from '../lib/local-chatbot'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Rhine, your virtual assistant. Ask me anything about our services, pricing, or travel destinations!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)

  const suggestedQuestions = getSuggestedQuestions()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const messageToSend = text || input.trim()
    if (!messageToSend || loading) return

    const userMessage = messageToSend
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    setShowSuggestions(false)

    try {
      const response = await getResponseWithDelay(userMessage, 500)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble right now. Please try again or contact support at /contact." 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-110 ai-chatbot-button"
        aria-label="Open AI Chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-40 w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 bg-indigo-600 px-4 py-3 dark:bg-indigo-700">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Rhine Assistant</span>
              <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">Local AI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                    <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-zinc-100'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700">
                    <User className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-zinc-800">
              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 p-3 dark:border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 dark:text-zinc-500 mt-2">
              Local AI • No data sent to external servers
            </p>
          </div>
        </div>
      )}
    </>
  )
}
'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-zinc-400 mb-6">An error occurred. Please refresh the page.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
'use client'

import { useState, useEffect, useCallback } from 'react'

const MEILI_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST_URL
const MEILI_SEARCH_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY

let client = null

async function getClient() {
  if (client) return client
  if (!MEILI_HOST || !MEILI_SEARCH_KEY) return null
  
  const { MeiliSearch } = await import('meilisearch')
  client = new MeiliSearch({
    host: MEILI_HOST,
    apiKey: MEILI_SEARCH_KEY,
  })
  return client
}

export function useMeilisearch(indexName = 'products') {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (query, options = {}) => {
    const c = await getClient()
    if (!c) {
      console.warn('Meilisearch not configured')
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const index = c.index(indexName)
      const searchResults = await index.search(query, {
        limit: options.limit || 10,
        offset: options.offset || 0,
        filter: options.filter || [],
        sort: options.sort || [],
        attributesToHighlight: options.highlight || ['title', 'description'],
        ...options,
      })

      setResults(searchResults.hits)
      return searchResults
    } catch (err) {
      setError(err.message)
      console.error('Meilisearch error:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [indexName])

  const searchMultiple = useCallback(async (query, indexes = ['products', 'blog', 'portfolio']) => {
    const c = await getClient()
    if (!c) {
      return {}
    }

    setLoading(true)
    setError(null)

    try {
      const promises = indexes.map(async (index) => {
        const idx = c.index(index)
        return idx.search(query, { limit: 5 })
      })

      const searchResults = await Promise.all(promises)
      const multiResults = {}
      
      indexes.forEach((index, i) => {
        multiResults[index] = searchResults[i].hits
      })

      return multiResults
    } catch (err) {
      setError(err.message)
      console.error('Meilisearch multi-search error:', err)
      return {}
    } finally {
      setLoading(false)
    }
  }, [])

  const isConfigured = !!(MEILI_HOST && MEILI_SEARCH_KEY)

  return {
    client,
    search,
    searchMultiple,
    results,
    loading,
    error,
    isConfigured,
  }
}

export default useMeilisearch
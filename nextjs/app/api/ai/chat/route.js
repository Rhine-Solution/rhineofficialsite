import { NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID

const systemPrompt = `You are a helpful AI assistant for Rhine Solution - an enterprise web development company. 
Your role is to help visitors with:
- Answering questions about services (web development, e-commerce, travel booking, portfolio)
- Guiding users to appropriate pages (Shop, Portfolio, Blog, Contact, Pricing, FAQ)
- Providing general information about the company
- Offering friendly, professional support

Keep responses concise (2-3 sentences max), friendly, and helpful. Always encourage users to contact the team for complex questions.`

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
      return NextResponse.json({ 
        error: 'OpenAI not configured - using fallback' 
      }, { status: 503 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error('OpenAI API error')
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I could not process your request.'

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json({ 
      response: "I apologize, but I'm having trouble connecting right now. Please try again later or visit our FAQ page."
    }, { status: 500 })
  }
}
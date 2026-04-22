import { COMBINED_KNOWLEDGE } from './chatbot-knowledge.js';

const PREDEFINED_QA = [
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'subscription', 'tier', 'basic', 'professional', 'enterprise', 'monthly', 'annual', 'year', '29', '99', '499'],
    response: `Rhine offers three subscription tiers:

**Basic (DIY)** - $29/month or $278/year
• Knowledge Base Access
• Email Support (48h response)
• Community Forum Access
• Video Tutorials Library

**Professional (DWY)** - $99/month or $950/year (Most Popular)
• Everything in Basic
• Live Chat Support (Business Hours)
• Monthly Tech Audit
• Guided Implementation
• Remote Assistance
• 14-day free trial

**Enterprise (DFY)** - $499/month or $4,790/year
• Everything in Professional
• 24/7 Priority Support (<30 min response)
• Dedicated Account Manager
• On-site Support (if local)
• Proactive Monitoring
• Custom Solutions

Would you like me to help you compare these plans in more detail?`
  },
  {
    keywords: ['travel', 'destination', 'trip', 'vacation', 'booking', 'maldives', 'bali', 'paris', 'tokyo', 'swiss', 'alps', 'island', 'beach', 'city', 'mountain'],
    response: `Rhine offers travel booking to premium destinations worldwide:

**Popular Destinations:**
• Bali Paradise - $1,299 (Beach, Indonesia)
• Paris Adventure - $1,899 (City, France)
• Tokyo Explorer - $2,199 (City, Japan)
• Maldives Luxury - $3,499 (Island, 5-star resort)
• Swiss Alps - $2,499 (Mountain, skiing)
• New York City - $1,799 (City, USA)

Each package includes accommodation, meals, airport transfers, guided tours, and activities.

Would you like me to recommend a destination based on your preferences?`
  },
  {
    keywords: ['support', 'contact', 'help', 'email', 'phone', 'call', 'assistance', 'response', 'time', 'hours'],
    response: `You can reach Rhine support through:

• **Contact Form**: /contact
• **Email**: contact@rhinesolution.com
• **Phone**: +1 (555) 123-4567 (Mon-Fri 9am-6pm)

**Response Times:**
• Standard: 24 hours
• Priority: 4 hours
• Enterprise: 30 minutes

Live Chat is available for Professional and Enterprise subscribers during business hours.

Would you like me to help you book a consultation call?`
  },
  {
    keywords: ['refund', 'cancel', 'cancellation', 'money back', 'policy', 'terms', 'guarantee', '30-day'],
    response: `Rhine's refund and cancellation policy:

• **30-day money-back guarantee** on all plans
• Cancel anytime - changes take effect next billing cycle
• No hidden fees or cancellation penalties
• Full refund to original payment method (5-7 business days)

For travel bookings, cancellations must be made 48+ hours before check-in.

For full details, visit /terms

Would you like me to explain our cancellation process?`
  },
  {
    keywords: ['portfolio', 'project', 'work', 'showcase', 'case study', 'client', 'github', 'demo', 'completed'],
    response: `Rhine has delivered 50+ projects across:

**Categories:**
• Python - Chatbots, Book Managers
• PHP - Webshops, OOP Portfolios
• Laravel - Job Boards
• Frontend - Responsive Websites
• React/Next.js - Travel Apps
• Svelte - Scheduling Apps

**Tech Stack:** React, Next.js, Supabase, Laravel, Python, PostgreSQL

View full portfolio at /portfolio with filtering by category.

Would you like to see examples of projects similar to your needs?`
  },
  {
    keywords: ['about', 'company', 'who', 'mission', 'team', 'founder', 'founded', 'history', 'values', 'quality'],
    response: `Rhine Solution - Enterprise Tech Solutions Provider

**Mission:** Make enterprise-grade technology accessible to businesses of all sizes.

**Stats:**
• 50+ Projects Completed
• 10+ Technologies
• 100% Client Satisfaction
• 24/7 Support

**Values:**
• Quality - Deliver solutions exceeding expectations
• Collaboration - Work together for best results
• Innovation - Continuously improve and adopt new tech
• Integrity - Honest and transparent dealings

Founded 2024, growing community of clients and partners.

Would you like to schedule a call to discuss how we can help?`
  },
  {
    keywords: ['tech', 'stack', 'technology', 'react', 'next', 'supabase', 'tailwind', 'vercel', 'cloudflare', 'database', 'postgresql'],
    response: `Rhine's technology stack:

• **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
• **Backend**: Node.js, Supabase (PostgreSQL)
• **Hosting**: Vercel, Cloudflare
• **Security**: Cloudflare Turnstile, SSL encryption
• **Payments**: Stripe
• **Analytics**: Plausible

We select the best tools for each project's specific requirements.

Would you like a technical consultation about your project architecture?`
  },
  {
    keywords: ['book', 'appointment', 'consultation', 'call', 'meeting', 'schedule', 'demo', 'free', '30 minutes'],
    response: `Book a free consultation with our team!

• **Duration**: 30 minutes
• **What we'll cover**: Your needs, recommended solutions, pricing
• **Availability**: Monday-Friday, 9am-6pm

Visit /contact to submit a request or book directly.

Would you like me to explain what to expect during the consultation?`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'hey', 'good morning', 'good afternoon', 'greetings', 'start', 'begin'],
    response: `Hello! I'm Rhine, your virtual assistant. I'm here to help you with:

• Questions about our services and pricing
• Travel destination recommendations
• Technical support guidance
• Booking consultations

What can I help you with today?

Try asking about:
- "What are your pricing plans?"
- "Tell me about travel destinations"
- "How do I book a consultation?"`
  },
  {
    keywords: ['ecommerce', 'shop', 'store', 'products', 'hosting', 'domain', 'ssl', 'backup', 'cart', 'checkout'],
    response: `Rhine's e-commerce services:

**Products Available:**
• Premium Web Hosting - $29/mo
• Domain Registration - $12/mo
• SSL Certificate - $49/mo
• Cloud Backup - $19/mo

Features include:
• Full online store with cart and checkout
• Multiple payment methods (Stripe)
• Order tracking in dashboard
• Inventory management

Visit /shop to browse all products.

Would you like help setting up your online store?`
  },
  {
    keywords: ['faq', 'question', 'questions', 'answer', 'help', 'common', 'how do i', 'what is'],
    response: `Here are some common questions:

**Getting Started:**
• Create account at /register
• Browse services in /shop
• Add to cart and checkout

**Account:**
• Reset password at /login (click Forgot Password)
• Update profile at /profile

**Payments:**
• We accept Visa, Mastercard, PayPal
• 30-day money-back guarantee

**Technical:**
• 99.9% uptime guarantee
• 24/7 monitoring
• Enterprise-grade security

Visit /faq for more questions!

Would you like me to help with something specific?`
  },
  {
    keywords: ['privacy', 'data', 'security', 'encrypt', 'protect', 'personal', 'information', 'gdpr'],
    response: `Rhine takes data privacy seriously:

**Security Measures:**
• SSL encryption (data in transit)
• PostgreSQL database with security
• Cloudflare Turnstile verification
• Regular security audits

**Your Rights:**
• Access your personal data
• Request correction of inaccurate data
• Request deletion of your data
• Object to processing of your data

We use trusted third parties (Stripe, Vercel) who are contractually obligated to protect your data.

For full policy, visit /privacy

Would you like more details about our security practices?`
  }
];

const FALLBACK_RESPONSE = `I don't have specific information about that, but I'd be happy to help you find what you need!

Here's what I can help with:
• Pricing and subscription plans
• Travel destinations and booking
• Company information and portfolio
• Technical support and FAQs
• Contact and consultation booking

Visit /contact to reach our support team directly, or try asking about something else!`;

const SUGGESTIONS = [
  "What are your pricing plans?",
  "Tell me about travel destinations",
  "How do I book a consultation?",
  "What's your refund policy?",
  "Show me your portfolio"
];

export function getLocalResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  let bestMatch = null;
  let highestScore = 0;
  
  for (const qa of PREDEFINED_QA) {
    let score = 0;
    for (const keyword of qa.keywords) {
      if (message.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    score = score / qa.keywords.length;
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = qa;
    }
  }
  
  if (bestMatch && highestScore > 0.1) {
    return bestMatch.response;
  }
  
  const knowledgeLower = COMBINED_KNOWLEDGE.toLowerCase();
  const words = message.split(' ').filter(w => w.length > 3);
  
  for (const word of words) {
    if (knowledgeLower.includes(word)) {
      const index = knowledgeLower.indexOf(word);
      const start = Math.max(0, index - 150);
      const end = Math.min(COMBINED_KNOWLEDGE.length, index + 350);
      const context = COMBINED_KNOWLEDGE.substring(start, end);
      
      return `Here's what I found about "${word}":\n\n...${context}...\n\nWould you like more specific information about this?`;
    }
  }
  
  return FALLBACK_RESPONSE;
}

export function getSuggestedQuestions() {
  return SUGGESTIONS;
}

export async function getResponseWithDelay(message, delayMs = 500) {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return getLocalResponse(message);
}
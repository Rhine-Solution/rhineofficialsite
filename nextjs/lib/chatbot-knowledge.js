const KNOWLEDGE_BASE = {
  homepage: `Rhine Solution - Enterprise Tech Solutions. 
Services: E-commerce, Travel Booking, Portfolio, Dashboard. 
Products: Web Hosting $29/mo, Domain $12/mo, SSL $49/mo, Cloud Backup $19/mo.
Stats: 10K+ customers, 99.9% uptime, 50+ integrations, 24/7 support.`,

  subscriptions: `Pricing Plans:
Basic DIY: $29/mo or $278/year - Knowledge Base, Email Support (48h), Community Forum, Video Tutorials
Professional DWY: $99/mo or $950/year - Everything in Basic + Live Chat, Monthly Tech Audit, Guided Implementation, Remote Assistance - Most Popular with 14-day trial
Enterprise DFY: $499/mo or $4790/year - Everything in Professional + 24/7 Priority Support, Dedicated Account Manager, On-site Support, Proactive Monitoring, Custom Solutions`,

  travel: `Travel Destinations: Bali Paradise $1,299 (Beach), Paris Adventure $1,899 (City), Tokyo Explorer $2,199 (City), Maldives Luxury $3,499 (Island), Swiss Alps $2,499 (Mountain), New York City $1,799 (City). Categories: Beach, City, Mountain, Island.`,

  portfolio: `Portfolio: Python Chatbot, Book Manager, PHP Webshop, OOP Portfolio, Laravel Job Board, Portfolio Website, Sunny Travels, Appointment App. Tech: React, Next.js, Laravel, Python, Supabase. Categories: Python, PHP, Laravel, Frontend, React/Next.js, Svelte.`,

  faq: `FAQ: 
- Rhine Solution is enterprise platform with e-commerce, travel, portfolio
- Get started: Create account, browse shop, add to cart, checkout
- Services: Hosting, Domains, SSL, SEO, Web Dev, Travel Booking
- Data security: SSL, Supabase, Turnstile, enterprise security
- Refund: 30-day money-back guarantee
- Tech stack: Next.js 14, React, Tailwind, Supabase, Vercel, Cloudflare`,

  contact: `Contact: Email contact@rhinesolution.com, Phone +1 (555) 123-4567 (Mon-Fri 9am-6pm), Worldwide remote support. Response: 24h standard, 4h priority, 30min enterprise.`,

  company: `About Rhine: Enterprise tech provider. Mission: make enterprise tech accessible. Stats: 50+ projects, 10+ technologies, 100% satisfaction, 24/7 support. Values: Quality, Collaboration, Innovation, Integrity. Founded 2024.`,

  policies: `Terms: Accept use, license for personal use only, user responsible for account, prohibited violations, no liability, as-is disclaimer. Privacy: Collect name/contact, credentials, payment (third-party), usage data. Use for service provision, transactions, communication, legal compliance. Security: encryption, technical measures. Your rights: access, correction, deletion, objection.`,

  blog: `Blog Posts: Building Scalable Web Apps with Next.js 14 (8 min), Future of Cloud Computing 2026 (6 min), Securing Web Apps Best Practices (10 min), PostgreSQL Performance (7 min), Edge Computing Intro (5 min), 10 IT Security Tips (5 min).`
};

export const COMBINED_KNOWLEDGE = Object.values(KNOWLEDGE_BASE).join('\n\n---\n\n');

export const RHINE_KNOWLEDGE_BASE = COMBINED_KNOWLEDGE;

export const KNOWLEDGE_TOKEN_COUNT = Math.ceil(COMBINED_KNOWLEDGE.length / 4);

export function getKnowledgeBase(maxTokens = 100000) {
  return RHINE_KNOWLEDGE_BASE;
}
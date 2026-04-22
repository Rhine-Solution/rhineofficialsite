import homepage from './homepage.md?raw';
import subscriptions from './subscriptions.md?raw';
import travel from './travel.md?raw';
import portfolio from './portfolio.md?raw';
import faq from './faq.md?raw';
import contact from './contact.md?raw';
import company from './company.md?raw';
import policies from './policies.md?raw';
import blog from './blog.md?raw';

export const KNOWLEDGE_BASE = {
  homepage,
  subscriptions,
  travel,
  portfolio,
  faq,
  contact,
  company,
  policies,
  blog,
};

export const COMBINED_KNOWLEDGE = Object.values(KNOWLEDGE_BASE).join('\n\n---\n\n');

export const SEARCH_TOPICS = {
  services: ['shop', 'e-commerce', 'hosting', 'domain', 'ssl', 'web development', 'travel booking', 'portfolio'],
  pricing: ['pricing', 'plans', 'subscription', 'basic', 'professional', 'enterprise', 'monthly', 'annual'],
  support: ['faq', 'help', 'support', 'contact', 'email', 'phone'],
  company: ['about', 'mission', 'team', 'values', 'timeline'],
  policies: ['terms', 'privacy', 'refund', 'cancellation', 'liability'],
  blog: ['blog', 'articles', 'news', 'tutorials', 'insights'],
};

export function searchKnowledge(query) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  for (const [topic, content] of Object.entries(KNOWLEDGE_BASE)) {
    if (content.toLowerCase().includes(lowerQuery)) {
      results.push({ topic, content: content.substring(0, 500) + '...' });
    }
  }

  return results;
}

export default KNOWLEDGE_BASE;
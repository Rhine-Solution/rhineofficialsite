export const BLOG_TEMPLATES = [
  {
    id: 'how-to',
    name: 'How-To Guide',
    structure: `# How to [Topic]

## Introduction
In this guide, we'll show you how to [brief description of what reader will learn].

## Prerequisites
- [Prerequisite 1]
- [Prerequisite 2]
- [Prerequisite 3]

## Step 1: [First Step Name]
[Detailed explanation of first step]

## Step 2: [Second Step Name]
[Detailed explanation of second step]

## Step 3: [Third Step Name]
[Detailed explanation of third step]

## Common Issues & Troubleshooting
- **Issue:** [Common problem]
  **Solution:** [How to fix it]

## Conclusion
You've successfully [achieved outcome]. For more guides, check out our [related resources].`,
    placeholders: ['Topic', 'brief description', 'Prerequisite 1', 'Prerequisite 2', 'Prerequisite 3', 'First Step Name', 'Second Step Name', 'Third Step Name', 'Common problem', 'How to fix it', 'achieved outcome', 'related resources']
  },
  {
    id: 'comparison',
    name: 'Comparison Post',
    structure: `# [Option A] vs [Option B]: Which is Right for You?

## Quick Comparison Table
| Feature | [Option A] | [Option B] |
|---------|------------|------------|
| [Feature 1] | [A Value (1)] | [B Value (1)] |
| [Feature 2] | [A Value (2)] | [B Value (2)] |
| [Feature 3] | [A Value (3)] | [B Value (3)] |
| Price | [A Price] | [B Price] |

## Deep Dive: [Option A]
[Detailed analysis of Option A - pros, cons, best use cases]

## Deep Dive: [Option B]
[Detailed analysis of Option B - pros, cons, best use cases]

## Our Recommendation
Based on your needs, we recommend [Option A/B] because [reason].

## Final Verdict
[Summary and closing thoughts]`,
    placeholders: ['Option A', 'Option B', 'Feature 1', 'A Value (1)', 'B Value (1)', 'Feature 2', 'A Value (2)', 'B Value (2)', 'Feature 3', 'A Value (3)', 'B Value (3)', 'A Price', 'B Price', 'Detailed analysis of Option A', 'Detailed analysis of Option B', 'Option A/B', 'reason', 'Summary']
  },
  {
    id: 'news',
    name: 'News / Announcement',
    structure: `# [Announcement Title]

**Date:** [Date]
**Author:** [Author Name]

## TL;DR
- [Key point 1]
- [Key point 2]
- [Key point 3]

## The Full Story
[Detailed announcement content]

## What This Means for You
[Impact on customers/users]

## Next Steps
- [Action item 1]
- [Action item 2]

## Questions?
Reach out to [contact information] or leave a comment below.`,
    placeholders: ['Announcement Title', 'Date', 'Author Name', 'Key point 1', 'Key point 2', 'Key point 3', 'Detailed announcement content', 'Impact on customers/users', 'Action item 1', 'Action item 2', 'contact information']
  },
  {
    id: 'listicle',
    name: 'Listicle (Top X)',
    structure: `# Top [Number] [Topic] You Need to Know in [Year]

## Introduction
[Brief introduction about why this list matters]

## [Number]. [Item 1]
[Description of item 1 - why it's important, how to use it]

## [Number-1]. [Item 2]
[Description of item 2]

## [Number-2]. [Item 3]
[Description of item 3]

*(Continue pattern for all items)*

## Honorable Mentions
- [Mention 1]
- [Mention 2]

## Conclusion
[Wrap-up and call to action]`,
    placeholders: ['Number', 'Topic', 'Year', 'Brief introduction', 'Item 1', 'Description 1', 'Item 2', 'Description 2', 'Item 3', 'Description 3', 'Mention 1', 'Mention 2', 'Wrap-up']
  },
  {
    id: 'case-study',
    name: 'Case Study',
    structure: `# Case Study: How [Client Name] Achieved [Result] with [Product/Service]

## Client Overview
**Client:** [Client Name]
**Industry:** [Industry]
**Challenge:** [Brief description of problem]

## The Challenge
[Detailed explanation of the problem they faced]

## Our Solution
[How Rhine helped solve the problem]

## The Results
- 📈 [Metric 1]: [Before (1)] → [After (1)] ([Percentage]% improvement)
- 📊 [Metric 2]: [Before (2)] → [After (2)]
- ⏱️ [Metric 3]: [Before (3)] → [After (3)]

## Client Testimonial
> "[Quote from client]"

## Key Takeaways
[Lessons learned that others can apply]`,
    placeholders: ['Client Name', 'Result', 'Product/Service', 'Industry', 'Brief description of problem', 'Detailed explanation', 'How Rhine helped', 'Metric 1', 'Before (1)', 'After (1)', 'Percentage', 'Metric 2', 'Before (2)', 'After (2)', 'Metric 3', 'Before (3)', 'After (3)', 'Quote from client', 'Lessons learned']
  }
];

export function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function generateMetaDescription(content, maxLength = 160) {
  const plainText = content.replace(/[#*`\[\]()]/g, '').substring(0, maxLength);
  return plainText.length >= maxLength ? plainText + '...' : plainText;
}
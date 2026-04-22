/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://rhinesolution.com',
  generateRobotsTxt: true,
  outDir: './out',
  generateIndexSitemap: false,
  exclude: [
    '/admin/**',
    '/dashboard/**',
    '/profile/**',
    '/orders/**',
    '/api/**',
  ],
}
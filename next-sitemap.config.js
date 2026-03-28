/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://scardubu.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    additionalSitemaps: [],
  },
  exclude: ['/api/*', '/_next/*', '/admin/*'],
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async () => {
    // Add blog posts to sitemap
    const blogPosts = [
      'production-ml-systems-2024',
      'ai-in-nigeria-opportunities',
      'ensemble-models-production',
      'fastapi-ml-engineers',
      'fastapi-deploy-production-5-min',
      'redis-caching-patterns-ml-apis',
    ];
    
    return blogPosts.map((slug) => ({
      loc: `/blog/${slug}`,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));
  },
  transform: async (defaultConfig, path) => {
    // Custom priority for important pages
    const priorities = {
      '/': 1.0,
      '/blog': 0.9,
      '/#projects': 0.9,
      '/#skills': 0.8,
      '/#testimonials': 0.7,
      '/#contact': 0.8,
    };

    return {
      loc: path,
      changefreq: path.startsWith('/blog') ? 'monthly' : defaultConfig.changefreq,
      priority: priorities[path] || (path.startsWith('/blog/') ? 0.8 : defaultConfig.priority),
      lastmod: new Date().toISOString(),
    };
  },
};

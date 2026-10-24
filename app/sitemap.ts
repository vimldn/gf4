import type { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = 'https://www.canieatthat.co.uk';
  return [
    { url: site, changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...blogPosts.map((post) => ({
      url: `${site}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

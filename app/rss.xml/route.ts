import { getAllPosts } from "@/app/lib/blog";
import { CONTACT_EMAIL } from "@/lib/config";

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = "https://scardubu.dev";

  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${CONTACT_EMAIL} (Oscar Ndugbu)</author>
      <category>${post.category}</category>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Oscar Ndugbu - Production ML Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Deep dives into backend systems, platform reliability, MLOps, and AI infrastructure from a Staff Backend and Platform Engineer based in Nigeria.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${CONTACT_EMAIL} (Oscar Ndugbu)</managingEditor>
    <webMaster>${CONTACT_EMAIL} (Oscar Ndugbu)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Oscar Ndugbu</copyright>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

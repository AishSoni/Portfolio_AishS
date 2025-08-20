import { baseURL, person } from '@/resources';
import { NextResponse } from 'next/server';

export async function GET() {
  // Generate RSS XML for portfolio (no blog posts)
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${person.name}'s Portfolio</title>
    <link>${baseURL}</link>
    <description>Portfolio website showcasing work by ${person.name}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <webMaster>${person.email} (${person.name})</webMaster>
    <atom:link href="${baseURL}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseURL}${person.avatar}</url>
      <title>${person.name}'s Portfolio</title>
      <link>${baseURL}</link>
    </image>
  </channel>
</rss>`;

  // Return the RSS XML with the appropriate content type
  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

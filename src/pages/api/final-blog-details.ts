import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NotionToMarkdown } from 'notion-to-md';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }

    try {
      const databaseId = process.env.NOTION_DATABASE_ID;

      if (!databaseId) {
        return res.status(400).json({ error: 'NOTION_DATABASE_ID is not set' });
      }

      // First, find the page by slug
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: 'slug',
              rich_text: {
                equals: slug,
              },
            },
            {
              property: 'Status',
              status: {
                does_not_equal: 'Draft',
              },
            },
          ],
        },
      });

      if (response.results.length === 0) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      // Type assertion for the page object
      const page = response.results[0] as PageObjectResponse;
      const pageId = page.id;

      // Get page blocks (content)
      const mdBlocks = await n2m.pageToMarkdown(pageId);
      const mdString = n2m.toMarkdownString(mdBlocks);

      // Use optional chaining with type assertion for properties
      const status = (page.properties as any).Status?.status?.name;
      const title = (page.properties as any).Name.title[0]?.plain_text || '';
      const date = (page.properties as any).Date.date?.start || '';
      const featured_image_url =
        (page.properties as any).cover_image?.files?.[0]?.file?.url ||
        (page.properties as any).cover_image?.files?.[0]?.external?.url ||
        '';
      const excerpt =
        (page.properties as any).excerpt?.rich_text?.[0]?.plain_text || '';

      const result = {
        status: 200,
        data: [
          {
            id: (page.properties as any).PostID?.unique_id?.number || pageId,
            title: { rendered: title },
            date: date,
            slug: slug,
            status: status,
            featured_image_url: featured_image_url,
            total_views_count: 100,
            excerpt: {
              rendered: excerpt,
              protected: false,
            },
            content: {
              markdown: {
                parent: mdString.parent,
              },
              protected: false,
            },
          },
        ],
      };

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

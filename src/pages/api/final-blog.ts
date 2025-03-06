import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const { page, per_page, categories, search } = req.query;

      const databaseId = process.env.NOTION_DATABASE_ID;

      if (!databaseId) {
        return res.status(400).json({ error: 'NOTION_DATABASE_ID is not set' });
      }

      const responseTotal = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: 'Status',
              status: {
                does_not_equal: 'Draft',
              },
            },
          ],
        },
      });
      const total_posts = responseTotal.results.length;

      const response = await notion.databases.query({
        database_id: databaseId,
        page_size: Number(per_page) || 6,
        filter: {
          and: [
            {
              property: 'Status',
              status: {
                does_not_equal: 'Draft',
              },
            },
          ],
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      });

      const blogPosts = response.results.map(async (result: any) => {
        const id = result.id;
        const status = result.properties.Status?.status?.name;
        const slug =
          result.properties.slug?.rich_text?.[0]?.plain_text
            ?.toLowerCase()
            .replace(/ /g, '-') || '';
        const featured_image_url =
          result.properties.cover_image?.files?.[0]?.file?.url ||
          result.properties.cover_image?.files?.[0]?.external?.url ||
          '';

        return {
          id: result.properties.PostID?.unique_id?.number || id,
          title: { rendered: result.properties.Name.title[0]?.plain_text },
          date: result.properties.Date.date?.start,
          slug: slug,
          status: status,
          featured_image_url: featured_image_url,
          total_views_count: 100,
          excerpt: {
            rendered:
              result.properties.excerpt?.rich_text?.[0]?.plain_text || '',
            protected: false,
          },
        };
      });

      const responses = {
        status: true,
        data: {
          total_pages: Math.ceil((total_posts || 0) / (Number(per_page) || 6)),
          total_posts: total_posts ? Number(total_posts) : 0,
          page: page ? Number(page) : 1,
          per_page: per_page ? Number(per_page) : 6,
          posts: await Promise.all(blogPosts),
        },
      };

      res.status(200).json(JSON.parse(JSON.stringify(responses)));
    } catch (error: any) {
      console.error('Error in final-blog API:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

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
      const slug = req.query.slug;

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
            {
              property: 'slug_auto',
              formula: {
                string: {
                  equals: slug?.toString() || '',
                },
              },
            },
          ],
        },
      });
      const post_result = responseTotal.results;

      if (post_result.length === 0) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      // Change from post_result[0].map to post_result.map
      const blogPosts = post_result.map(async (result: any) => {
        const id = result.id;
        const mdblocks = await n2m.pageToMarkdown(id);
        const mdString = n2m.toMarkdownString(mdblocks); // cspell:disable-line
        const status = result.properties.Status?.status?.name;
        const slug =
          result.properties.slug?.rich_text?.[0]?.plain_text
            ?.toLowerCase()
            .replace(/ /g, '-') || '';
        const slug_auto = result.properties.slug_auto?.formula?.string;
        const featured_image_url =
          result.properties.cover_image?.files?.[0]?.file?.url ||
          result.properties.cover_image?.files?.[0]?.external?.url ||
          '';

        //const unique_id_property = result.properties.get("PostID", {});
        //const unique_id_value = result.properties.PostID.unique_id.number

        //const prefix = unique_id_value.get("prefix");
        //const mynumber = unique_id_value.get("number");
        return {
          id: result.id,
          title: { rendered: result.properties.Name.title[0]?.plain_text },
          date: result.properties.Date.date?.start,
          slug: slug,
          slug_auto: slug_auto,
          status: status,
          featured_image_url: featured_image_url,
          total_views_count: 100,
          excerpt: {
            rendered:
              result.properties.excerpt?.rich_text?.[0]?.plain_text || '',
            protected: false,
          },
          content: { markdown: mdString, protected: false },
        };
      });

      // const responses = {
      //   status: true,
      //   data: {
      //     total_pages: 1,
      //     total_posts: 1,
      //     page: page ? Number(page) : 1,
      //     per_page: per_page ? Number(per_page) : 6,
      //     posts: await Promise.all(blogPosts),
      //   },
      // };

      const responses = {
        status: true,
        data: await Promise.all(blogPosts),
      };

      // const responses = await Promise.all(blogPosts);

      res.status(200).json(JSON.parse(JSON.stringify(responses)));
      //const resolvedBlogPosts = await Promise.all(responses);
      //res.status(200).json(blogPosts);
      //res.status(200).json(resolvedBlogPosts);
    } catch (error: any) {
      res.status(200).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

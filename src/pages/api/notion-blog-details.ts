import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NotionToMarkdown } from 'notion-to-md';
import { getPageBlocks } from '@/modules/blog/components/BlogDetailsFromToken';
import { NotionRenderer } from '@/common/utils/NotionRenderer';
import styles from '@/styles/NotionBlog.module.css';
import { n2m } from '@/services/n2m'; //"../n2m";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

//const n2m = new NotionToMarkdown({ notionClient: notion });

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

        // //Set custom transformer for column lists
        // n2m.setCustomTransformer("column_list", async (block) => {
        //   const columns = await n2m.pageToMarkdown(block.id);
        //   // Use markdown-compatible syntax for columns
        //   let columnContent = '';

        //   for (const column of columns) {
        //     const content = await n2m.toMarkdownString(column.children);
        //     // Wrap content in a div with proper markdown syntax
        //     columnContent += `<div class="column">\n\n${content.parent}\n\n</div>`;
        //   }

        //   // Return properly formatted HTML that will be rendered correctly
        //   return `<div class="column-list">\n\n${columnContent}\n\n</div>`;
        // });

        // Get markdown blocks and convert to string
        const mdblocks = await n2m.pageToMarkdown(id);
        const mdString = await n2m.toMarkdownString(mdblocks);

        // n2m.setCustomTransformer("column_list", async (mdblocks) => {
        //   const mdBlocks_temp = await n2m.pageToMarkdown(mdblocks.id);
        //   let final_md_string = `<div className="column" style={{ display: "flex", columnGap: "25px" }}>`;

        //   for (const one_block of mdBlocks_temp) {
        //     const mdString_temp = n2m.toMarkdownString(one_block.children);
        //     final_md_string = final_md_string + `<div>${mdString_temp}</div>`
        //   }

        //   return final_md_string + "</div>"
        // });

        // Convert to markdown string after setting the transformer

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

        const tags =
          result.properties.tags?.multi_select?.map((tag: any) => ({
            term_id: tag.id,
            name: tag.name,
            color: tag.color,
          })) || [];

        // const notionRenderer = new NotionRenderer({
        //   config: {
        //     heading: {
        //       className: styles.notionHeading
        //     },
        //     text: {
        //       className: styles.notionText
        //     },
        //     image: {
        //       className: styles.notionImage
        //     }
        //   }
        // });

        // const blocks = await getPageBlocks("2e22de6b770e4166be301490f6ffd420");
        // // You could pass additional options if your render method supports them
        // const contentHtml = notionRenderer.render(blocks);

        // Or transform the blocks before rendering if needed
        // const contentHtml = notionRenderer.render(transformBlocks(blocks));
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
          tags_list: tags,
          page_content: {
            rendered:
              result.properties.page_content?.rich_text?.[0]?.plain_text || '',
            protected: false,
          },
          content: { markdown: mdString, protected: false },
          full: post_result,
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

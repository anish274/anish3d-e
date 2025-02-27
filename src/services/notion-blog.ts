import { Client } from '@notionhq/client';

import { BlogItemProps } from '@/common/types/blog';

// Initializing a new Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getBlogList = async ({
  page = 1,
  per_page = 6,
  search,
}: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<{ status: number; data: any }> => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID as string;

    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: page ? String((page - 1) * per_page) : undefined,
      page_size: per_page,
      filter: search
        ? {
            property: 'title',
            rich_text: {
              contains: search,
            },
          }
        : undefined,
    });

    const results = response.results.map((result: any) => {
      return {
        id: result.id,
        title: result.properties.title.title[0].plain_text,
        slug: result.properties.slug.rich_text[0].plain_text,
        date: result.properties.date.date.start,
        excerpt: result.properties.excerpt.rich_text[0].plain_text,
        featured_image_url:
          result.properties.featured_image.files[0]?.file.url ||
          result.properties.featured_image.files[0]?.external.url,
      };
    });

    const total_posts = response.has_more ? null : response.results.length;
    const total_pages = response.has_more
      ? null
      : Math.ceil(response.results.length / per_page);

    return {
      status: 200,
      data: { posts: results, page, per_page, total_pages, total_posts },
    };
  } catch (error: any) {
    console.error(error);
    return { status: 500, data: { message: error.message } };
  }
};

export const getBlogBySlug = async (
  slug: string,
): Promise<{ status: number; data: BlogItemProps | null }> => {
  try {
    const response = await notion.pages.retrieve({ page_id: slug });

    const result: any = response;
    return {
      status: 200,
      data: {
        id: result.id,
        title: (result.properties.title as any).title[0].plain_text,
        slug: (result.properties.slug as any).rich_text[0].plain_text,
        date: (result.properties.date as any).date.start,
        excerpt: (result.properties.excerpt as any).rich_text[0].plain_text,
        featured_image_url:
          (result.properties.featured_image as any).files[0]?.file.url ||
          (result.properties.featured_image as any).files[0]?.external.url,
      },
    };
  } catch (error: any) {
    console.error(error);
    return { status: 500, data: { message: error.message } };
  }
};

export const getNotionBlogById = async (blogId: string) => {
  try {
    const blogIdInt = parseInt(blogId, 10);

    const databaseId = process.env.NOTION_DATABASE_ID as string;
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
            property: 'PostID',
            number: {
              equals: blogIdInt,
            },
          },
        ],
      },
    });
    const total_posts = responseTotal.results.length;

    // const response = await notion.pages.retrieve({ page_id: pageId });
    // const blocks = await notion.blocks.children.list({ block_id: pageId });

    const result: any = response;
    const content = blocks.results
      .map((block: any) => {
        switch (block.type) {
          case 'paragraph':
            return {
              type: 'paragraph',
              text: block.paragraph.rich_text[0]?.plain_text || '',
            };
          case 'heading_1':
            return {
              type: 'heading_1',
              text: block.heading_1.rich_text[0]?.plain_text || '',
            };
          case 'heading_2':
            return {
              type: 'heading_2',
              text: block.heading_2.rich_text[0]?.plain_text || '',
            };
          case 'image':
            return {
              type: 'image',
              url: block.image.file?.url || block.image.external?.url || '',
            };
          default:
            return null;
        }
      })
      .filter(Boolean);

    return {
      status: 200,
      data: {
        id: result.id,
        title: result.properties.title.title[0].plain_text,
        slug: result.properties.slug.rich_text[0].plain_text,
        date: result.properties.date.date.start,
        excerpt: result.properties.excerpt.rich_text[0].plain_text,
        featured_image_url:
          result.properties.featured_image.files[0]?.file.url ||
          result.properties.featured_image.files[0]?.external.url,
        content,
      },
    };
  } catch (error: any) {
    console.error('Error fetching Notion blog detail:', error);
    return { status: 404, data: null };
  }
};

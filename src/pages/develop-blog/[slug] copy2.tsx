import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import styles from '@/styles/NotionBlog.module.css';
import { NotionRenderer } from '@/common/utils/NotionRenderer';
import BackButton from '@/common/components/elements/BackButton';
import Container from '@/common/components/elements/Container';

import { getPageBlocks } from '@/modules/blog/components/BlogDetailsFromToken';

const GiscusComment = dynamic(
  () => import('@/modules/blog/components/GiscusComment'),
);

interface NotionBlogDetailPageProps {
  blog: {
    data: any;
  };
}

const NotionBlogDetailPage: NextPage<NotionBlogDetailPageProps> = ({
  blog,
}) => {
  const blogDataArray = blog.data || {};
  const blogData = blogDataArray[0];

  const slug = `develop-blog/${blogData?.slug_auto}`;
  const canonicalUrl = `https://anish3d.com/${slug}`;
  const description = blogData?.excerpt?.rendered;

  // Convert Notion blocks to HTML with proper null checks
  let contentHtml = '';

  try {
    const notionRenderer = new NotionRenderer({
      config: {
        heading: {
          className: styles.notionHeading,
        },
        text: {
          className: styles.notionText,
        },
        image: {
          className: styles.notionImage,
        },
      },
    });

    contentHtml = blocks ? notionRenderer.render(blocks) : '';
    // Fetch and process Notion blocks
    if (blogData?.content?.blocks) {
      try {
        // Add blocks to the renderer
        notionRenderer.addBlocks(blogData.content.blocks);
      } catch (error) {
        console.error('Error adding Notion blocks:', error);
      }
    }
    contentHtml = notionRenderer.render(blocks);
    contentHtml = blogData.content.markdown.parent;
  } catch (error) {
    console.error('Error rendering Notion content:', error);
    contentHtml = '<p>Error rendering content</p>';
  }
  // Removed the extra closing curly brace that was here

  return (
    <>
      <NextSeo
        title={`${blogData?.title?.rendered} - Development Blog ${process.env.NEXT_PUBLIC_FULL_NAME}`}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: blogData?.date,
            modifiedTime: blogData?.date,
            authors: [process.env.NEXT_PUBLIC_FULL_NAME || ''],
          },
          url: canonicalUrl,
          images: [
            {
              url: blogData?.featured_image_url,
            },
          ],
          siteName: 'Development Blog',
        }}
      />
      <Container data-aos='fade-up'>
        <BackButton url='/develop-blog' />
        {blogData?.featured_image_url && (
          <div className={styles.heroImage}>
            <Image
              src={blogData.featured_image_url}
              alt={blogData?.title?.rendered || 'Blog post cover'}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className={styles.heroContent}>
              <h1>{blogData?.title?.rendered}</h1>
              <p>{description}</p>
            </div>
          </div>
        )}
        <div
          className={styles.notionContent}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <section id='comments'>
          <GiscusComment isEnableReaction={false} />
        </section>
      </Container>
    </>
  );
};

export default NotionBlogDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.query?.slug as string;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/notion-blog-details?slug=${slug}`,
    );
    const blog = response.data;

    if (!blog) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        blog,
      },
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      notFound: true,
    };
  }
};

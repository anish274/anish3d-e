import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';

import BackButton from '@/common/components/elements/BackButton';
import Container from '@/common/components/elements/Container';
import { BlogDetailProps } from '@/common/types/blog';
import BlogDetailContent from '@/modules/final-blog/components/BlogDetailContent';
import styles from '@/styles/FinalBlog.module.css';

const GiscusComment = dynamic(
  () => import('@/modules/blog/components/GiscusComment'),
);

interface FinalBlogDetailPageProps {
  blog: {
    status: number;
    data: any;
  };
}

const FinalBlogDetailPage: NextPage<FinalBlogDetailPageProps> = ({ blog }) => {
  const blogDataArray = blog.data || {};
  const blogData = blogDataArray[0];

  const slug = `final-blog/${blogData?.slug}`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`;
  const description = blogData?.excerpt?.rendered;

  const incrementViews = async () => {
    try {
      await axios.post(`/api/views?&slug=${blogData?.slug}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      incrementViews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NextSeo
        title={`${blogData?.title?.rendered} - Final Blog | ${process.env.NEXT_PUBLIC_FULL_NAME}`}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: blogData?.date,
            modifiedTime: blogData?.date,
            authors: [`${process.env.NEXT_PUBLIC_FULL_NAME}`],
          },
          url: canonicalUrl,
          images: [
            {
              url: blogData?.featured_image_url,
            },
          ],
          siteName: `${process.env.NEXT_PUBLIC_FULL_NAME} Blog`,
        }}
      />
      <Container data-aos='fade-up'>
        <BackButton url='/final-blog' />
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
        <BlogDetailContent {...blogData} />
        <section id='comments'>
          <GiscusComment isEnableReaction={false} />
        </section>
      </Container>
    </>
  );
};

export default FinalBlogDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.query?.slug as string;

  try {
    console.log(
      'Debug - Fetching URL:',
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/final-blog-details?slug=${slug}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/final-blog-details?slug=${slug}`,
    );
    console.log('Debug - API Response:', response.data);
    const blog = response.data;

    if (!blog) {
      console.log('Debug - No blog data found');
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
    console.error('Debug - Error fetching blog:', error);
    return {
      notFound: true,
    };
  }
};

import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { getNotionBlogDetail } from '@/services/notion-blog';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';

import BackButton from '@/common/components/elements/BackButton';
import Container from '@/common/components/elements/Container';
import { formatExcerpt } from '@/common/helpers';
import { BlogDetailProps } from '@/common/types/blog';
import BlogDetail from '@/modules/blog/components/BlogDetail';

const GiscusComment = dynamic(
  () => import('@/modules/blog/components/GiscusComment'),
);

interface BlogDetailPageProps {
  blog: BlogDetailProps;
}

const BlogDetailPage: NextPage<BlogDetailPageProps> = ({ blog }) => {
  const blogData = blog || {};

  const slug = `discover-blog/${blogData?.slug}`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_CANONICAL_URL}/${slug}`;
  const description = formatExcerpt(blogData?.excerpt?.rendered);

  const incrementViews = async () => {
    await axios.post(`/api/views?&slug=${blogData?.slug}`);
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
        title={`${blogData?.title} - Discover Blog ${process.env.NEXT_PUBLIC_FULL_NAME}`}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: blogData?.date,
            modifiedTime: blogData?.date,
            authors: ['${process.env.NEXT_PUBLIC_FULL_NAME}'],
          },
          url: canonicalUrl,
          images: [
            {
              url: blogData?.featured_image_url,
            },
          ],
          siteName: 'anish shah blog',
        }}
      />
      <Container data-aos='fade-up'>
        <BackButton url='/discover-blog' />
        <BlogDetail {...blogData} />
        <section id='comments'>
          <GiscusComment isEnableReaction={false} />
        </section>
      </Container>
    </>
  );
};

export default BlogDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const blogId = context.query?.id as string;

  if (!blogId) {
    return {
      redirect: {
        destination: '/discover-blog',
        permanent: false,
      },
    };
  }

  try {
    const post = await getNotionBlogDetail(blogId);

    if (!post || post?.status === 404) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        blog: post.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

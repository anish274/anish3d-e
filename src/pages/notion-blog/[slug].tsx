import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';

import BackButton from '@/common/components/elements/BackButton';
import Container from '@/common/components/elements/Container';
import { formatExcerpt } from '@/common/helpers';
import { BlogDetailProps } from '@/common/types/blog';
import BlogDetail from '@/modules/blog/components/BlogDetail';
import { getNotionBlogDetail } from '@/services/notion-blog';

const GiscusComment = dynamic(
  () => import('@/modules/blog/components/GiscusComment'),
);

interface NotionBlogDetailPageProps {
  blog: {
    data: BlogDetailProps;
  };
}

const NotionBlogDetailPage: NextPage<NotionBlogDetailPageProps> = ({
  blog,
}) => {
  const blogData = blog?.data || {};

  const slug = `notion-blog/${blogData?.slug}?id=${blogData?.id}`;
  const canonicalUrl = `https://aulianza.id/${slug}`;
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
        title={`${blogData?.title?.rendered} - Notion Blog ${process.env.NEXT_PUBLIC_FULL_NAME}`}
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
          siteName: 'aulianza blog',
        }}
      />
      <Container data-aos='fade-up'>
        <BackButton url='/notion-blog' />
        <BlogDetail {...blogData} />
        <section id='comments'>
          <GiscusComment isEnableReaction={false} />
        </section>
      </Container>
    </>
  );
};

export default NotionBlogDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const blogId = context.query?.id as string;

  if (!blogId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const response = await getNotionBlogDetail(blogId);

  if (response?.status === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return {
    props: {
      blog: response,
    },
  };
};

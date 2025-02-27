import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';

import BackButton from '@/common/components/elements/BackButton';
import Container from '@/common/components/elements/Container';
// import { formatExcerpt } from '@/common/helpers';
import { BlogDetailProps } from '@/common/types/blog';
import BlogDetailNotion from '@/modules/blog/components/BlogDetailNotion';

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
  // const blogData = JSON.stringify(blog.data, null, 2) || {};
  const blogDataArray = blog.data || {};
  const blogData = blogDataArray[0];
  // console.log("Blog TTTTTTTTTTTTTitle:", blogData[0]?.title?.rendered);
  // console.log("Blog Data Structured:",  blogData );

  const slug = `notion-blog/${blogData?.slug}`;
  const canonicalUrl = `https://anish3d.com/${slug}`;
  //const description = formatExcerpt(blogData?.excerpt?.rendered);
  const description = blogData?.excerpt?.rendered;
  // const description = blogData?.content?.markdown?.parent;

  // const incrementViews = async () => {
  //   await axios.post(`/api/views?&slug=${blogData?.slug}`);
  // };

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'production') {
  //     incrementViews();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
          siteName: 'anish shah blog',
        }}
      />
      <Container data-aos='fade-up'>
        <BackButton url='/notion-blog' />
        <BlogDetailNotion {...blogData} />
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
    console.log(
      'Debug - Fetching URL:',
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/notion-blog?slug=${slug}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/notion-blog-details?slug=${slug}`,
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const blogId = context.query?.id as string;

//   if (!blogId) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   const response = await getNotionBlogById(blogId);
//   console.log('response', response);
//   // if (response?.status === 404) {
//   //   return {
//   //     redirect: {
//   //       destination: '/404',
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   return {
//     props: {
//       blog: response,
//     },
//   };
// };

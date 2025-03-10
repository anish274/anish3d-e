import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import NotionBlogList from '@/modules/blog';

const PAGE_TITLE = 'Notion Blog';

const NotionBlogPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE} - ${process.env.NEXT_PUBLIC_FULL_NAME}`} />
      <Container className='xl:!-mt-5' data-aos='fade-up'>
        <NotionBlogList />
      </Container>
    </>
  );
};

export default NotionBlogPage;

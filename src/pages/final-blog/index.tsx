import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import FinalBlogList from '@/modules/final-blog';

const PAGE_TITLE = 'Final Blog';

const FinalBlogPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE} - ${process.env.NEXT_PUBLIC_FULL_NAME}`} />
      <Container className='xl:!-mt-5' data-aos='fade-up'>
        <FinalBlogList />
      </Container>
    </>
  );
};

export default FinalBlogPage;

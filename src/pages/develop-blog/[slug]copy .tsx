import 'react-notion/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';

import { NotionRenderer, BlockMapType } from 'react-notion';
import { useRouter } from 'next/router';
import { getPageBlocks } from '@/modules/blog/components/BlogDetailsFromToken';

interface PostProps {
  blocks: BlockMapType;
}

// Add getStaticPaths function
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  try {
    const blocks = await getPageBlocks('2e22de6b770e4166be301490f6ffd420');

    return {
      props: {
        blocks,
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      notFound: true,
    };
  }
}

const BlogPost: React.FC<PostProps> = ({ blocks }) => {
  return (
    <>
      <div className='md:mb-18 mb-12 mt-8 px-4 md:mt-12'>
        <h1 className='mb-2 text-2xl font-bold sm:text-center md:text-3xl'>
          "AAAAAAAAAAAAAAAAAAAAA"
        </h1>
      </div>
      <article className='mx-auto w-full max-w-3xl flex-1 px-4'>
        <NotionRenderer blockMap={blocks} />
      </article>
    </>
  );
};
export default BlogPost;

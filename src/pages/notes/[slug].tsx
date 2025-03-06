import { GetStaticPaths, GetStaticProps } from 'next';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import Prism from 'prismjs';
import { useEffect } from 'react';

// import { XIcon } from '../../components/icons/XIcon';
import { NoteLayout } from '@/modules/blog/components/NoteLayout';
import { NotionBlockRenderer } from '@/modules/blog/components/NotionBlockRenderer';
import { Note as NoteType, notesApi } from '@/services/notesApi';

type Props = {
  note: NoteType;
  noteContent: any[];
};

export default function Note({
  note: { title, description, createdAt, slug },
  noteContent,
}: Props) {
  const url = `${process.env.NEXT_PUBLIC_URL}/notes/${slug}`;
  const openGraphImageUrl = `${process.env.NEXT_PUBLIC_URL}/api/og?title=${title}&description=${description}`;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          images: [{ url: openGraphImageUrl }],
        }}
      />
      <ArticleJsonLd
        url={url}
        images={[openGraphImageUrl]}
        title={title}
        datePublished={createdAt}
        authorName='Bartosz Jarocki'
        description={description}
      />
      <NoteLayout meta={{ title, description, date: createdAt }}>
        <div className='anishshah pb-32'>
          {noteContent.map((block) => (
            <NotionBlockRenderer key={block.id} block={block} />
          ))}

          <hr />

          <a
            className='group block text-xl font-semibold no-underline md:text-3xl'
            href={`http://x.com/share?text=${title}&url=${url}`}
          >
            <h4 className='group-hover:text-primary group-hover:fill-primary text-wrap flex max-w-lg cursor-pointer flex-col fill-white duration-200 ease-in-out'>
              {/* <XIcon className="my-6 h-10 w-10 transform transition-transform group-hover:-rotate-12 text-black dark:text-white group-hover:text-primary" /> */}
              Click here to share this article with your friends on X if you
              liked it.
            </h4>
          </a>
        </div>
      </NoteLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (
  context,
) => {
  const slug = context.params?.slug as string;
  if (!slug) {
    return {
      notFound: true,
    };
  }

  const allNotes = await notesApi.getNotes();
  console.log(allNotes);
  const note = allNotes.find((note) => note.slug === slug);
  //const note = await notesApi.getNote(slug); // Assuming notesApi.getNote can now fetch by slug
  console.log('B1B1');
  if (!note) {
    return {
      notFound: true,
    };
  }
  console.log('C2C2');
  const noteContent = await notesApi.getNote(note.id);
  console.log(noteContent);
  console.log('D2D2');
  return {
    props: {
      note,
      noteContent,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await notesApi.getNotes();

  const validPosts = posts.filter((post) => post.slug);

  return {
    paths: validPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  };
};

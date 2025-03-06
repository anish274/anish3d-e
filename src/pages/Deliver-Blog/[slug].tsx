import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { notesApi } from '../../services/notesApi';

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        try {
          // Assuming the slug is the ID of the Notion page
          const data = await notesApi.getNote(slug as string);
          setPost(data);
        } catch (error) {
          console.error('Error fetching post:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div>
      <h1>{slug}</h1>
      {/* Display the actual content of the blog post here */}
      {post.map((block, index) => (
        <div key={index}>
          {block.type === 'paragraph' && (
            <p>{block.paragraph.rich_text[0]?.plain_text}</p>
          )}
          {block.type === 'heading_1' && (
            <h1>{block.heading_1.rich_text[0]?.plain_text}</h1>
          )}
          {block.type === 'heading_2' && (
            <h2>{block.heading_2.rich_text[0]?.plain_text}</h2>
          )}
          {block.type === 'heading_3' && (
            <h3>{block.heading_3.rich_text[0]?.plain_text}</h3>
          )}
          {/* Add more block types as needed */}
        </div>
      ))}
    </div>
  );
};

export default BlogPost;

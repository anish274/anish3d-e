import { useEffect, useState } from 'react';
import { notesApi } from '../../services/notesApi';

const DeliverBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await notesApi.getNotes();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Deliver Blog</h1>
      {posts.map((post: any) => (
        <div key={post.id}>
          <h2>{post.properties.Name.title[0].plain_text}</h2>
          <p>{post.properties.Description.rich_text[0].plain_text}</p>
        </div>
      ))}
    </div>
  );
};

export default DeliverBlog;

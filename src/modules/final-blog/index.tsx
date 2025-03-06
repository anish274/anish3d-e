import { useState, useEffect } from 'react';
import axios from 'axios';
import { BlogItemProps } from '@/common/types/blog';

import BlogCard from '@/modules/blog/components/BlogCard';
import SectionHeading from '@/common/components/elements/SectionHeading';
import EmptyState from '@/common/components/elements/EmptyState';
import Pagination from '@/common/components/elements/Pagination';

const FinalBlogList = () => {
  const [blogs, setBlogs] = useState<BlogItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/final-blog?page=${page}&per_page=6`,
      );
      setBlogs(response.data.data.posts);
      setTotalPages(response.data.data.total_pages);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <section>
      <div className='flex flex-col gap-y-8'>
        <SectionHeading title='Final Blog' description='Articles from Notion' />

        {loading ? (
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <BlogCard key={i} isLoading={true} />
            ))}
          </div>
        ) : (
          <>
            {blogs.length > 0 ? (
              <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
                {blogs.map((blog, index) => (
                  <BlogCard key={index} {...blog} type='final-blog' />
                ))}
              </div>
            ) : (
              <EmptyState message='No blog posts found' />
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FinalBlogList;

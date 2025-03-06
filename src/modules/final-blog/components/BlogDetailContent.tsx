import React from 'react';
import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from '@/styles/FinalBlog.module.css';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('css', css);

interface BlogDetailContentProps {
  content?: {
    markdown?: {
      parent?: string;
    };
  };
  title?: {
    rendered?: string;
  };
  date?: string;
  total_views_count?: number;
}

const BlogDetailContent: React.FC<BlogDetailContentProps> = ({
  content,
  title,
  date,
  total_views_count,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const markdownContent = content?.markdown?.parent || '';

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.blogContent}>
      <div className='mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
        <div>{formatDate(date || '')}</div>
        <div>{total_views_count} views</div>
      </div>

      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={isDark ? a11yDark : prism}
                customStyle={{
                  padding: '20px',
                  fontSize: '14px',
                  borderRadius: '8px',
                }}
                language={match[1]}
                PreTag='div'
                wrapLongLines={true}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default BlogDetailContent;

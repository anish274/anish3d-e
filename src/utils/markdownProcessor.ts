import rehypeRaw from 'rehype-raw';

// Add rehypeRaw to your processor to ensure HTML is parsed
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw) // This ensures HTML in markdown is properly parsed
  .use(rehypeStringify);

import { Block } from '@notionhq/client/build/src/api-types';

interface NotionRendererConfig {
  heading?: {
    className?: string;
  };
  text?: {
    className?: string;
  };
  image?: {
    className?: string;
  };
}

export class NotionRenderer {
  private config: NotionRendererConfig;

  constructor(options: { config?: NotionRendererConfig } = {}) {
    this.config = options.config || {};
  }

  render(blocks: Block[]): string {
    if (!Array.isArray(blocks)) return '';

    return blocks.map((block) => this.renderBlock(block)).join('\n');
  }

  private renderBlock(block: any): string {
    switch (block.type) {
      case 'paragraph':
        return this.renderParagraph(block);
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        return this.renderHeading(block);
      case 'image':
        return this.renderImage(block);
      case 'bulleted_list_item':
        return this.renderListItem(block);
      case 'numbered_list_item':
        return this.renderNumberedListItem(block);
      case 'code':
        return this.renderCode(block);
      case 'quote':
        return this.renderQuote(block);
      default:
        return '';
    }
  }

  private renderParagraph(block: any): string {
    const text = this.renderRichText(block.paragraph.rich_text);
    const className = this.config.text?.className || '';
    return `<p class="${className}">${text}</p>`;
  }

  private renderHeading(block: any): string {
    const level = block.type.split('_')[1];
    const text = this.renderRichText(block[block.type].rich_text);
    const className = this.config.heading?.className || '';
    return `<h${level} class="${className}">${text}</h${level}>`;
  }

  private renderImage(block: any): string {
    const imageUrl = block.image.file?.url || block.image.external?.url;
    const caption =
      block.image.caption?.length > 0
        ? this.renderRichText(block.image.caption)
        : '';
    const className = this.config.image?.className || '';

    return `
      <figure class="${className}">
        <img src="${imageUrl}" alt="${caption}" />
        ${caption ? `<figcaption>${caption}</figcaption>` : ''}
      </figure>
    `;
  }

  private renderListItem(block: any): string {
    const text = this.renderRichText(block.bulleted_list_item.rich_text);
    return `<li>${text}</li>`;
  }

  private renderNumberedListItem(block: any): string {
    const text = this.renderRichText(block.numbered_list_item.rich_text);
    return `<li>${text}</li>`;
  }

  private renderCode(block: any): string {
    const code = this.renderRichText(block.code.rich_text);
    const language = block.code.language || '';
    return `
      <pre><code class="language-${language}">
        ${code}
      </code></pre>
    `;
  }

  private renderQuote(block: any): string {
    const text = this.renderRichText(block.quote.rich_text);
    return `<blockquote>${text}</blockquote>`;
  }

  private renderRichText(richText: any[]): string {
    if (!richText || !Array.isArray(richText)) return '';

    return richText
      .map((text) => {
        let content = this.escapeHtml(text.plain_text);

        if (text.annotations.bold) content = `<strong>${content}</strong>`;
        if (text.annotations.italic) content = `<em>${content}</em>`;
        if (text.annotations.strikethrough) content = `<del>${content}</del>`;
        if (text.annotations.underline) content = `<u>${content}</u>`;
        if (text.annotations.code) content = `<code>${content}</code>`;

        if (text.href)
          content = `<a href="${text.href}" target="_blank" rel="noopener noreferrer">${content}</a>`;

        return content;
      })
      .join('');
  }

  private escapeHtml(text: string): string {
    const htmlEntities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
  }
}

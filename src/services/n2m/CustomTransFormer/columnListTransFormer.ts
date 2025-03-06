import { ListBlockChildrenResponseResult } from 'notion-to-md/build/types';
import { n2m } from '..';

export const columnListTransFormer = async (
  block: ListBlockChildrenResponseResult,
) => {
  const mdBlocks_temp = await n2m.pageToMarkdown(block.id);
  let final_md_string = `\n\n <div className="md:flex" style={{ columnGap: "25px" }}>`;

  for (const one_block of mdBlocks_temp) {
    const mdString_temp = n2m.toMarkdownString(one_block.children);
    final_md_string =
      final_md_string +
      `<div style={{width : "100%", display : "flex", flexDirection : "column"}}>\n\n${mdString_temp.parent}\n\n</div>`;
  }

  return final_md_string + '</div>';
};

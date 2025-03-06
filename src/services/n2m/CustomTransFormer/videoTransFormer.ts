import { VideoBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { ListBlockChildrenResponseResult } from 'notion-to-md/build/types';

const extractYoutubeVideoId = (url: string) => {
  const pattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);

  return match && match[1] ? match[1] : '';
};

export const videoTransFormer = async (
  block: ListBlockChildrenResponseResult,
) => {
  const { video } = block as VideoBlockObjectResponse;

  let url: string = '';

  if (video.type === 'external' && video.external.url.includes('youtube')) {
    url =
      'https://www.youtube.com/embed/' +
      extractYoutubeVideoId(video.external.url);
  }

  return `
    <figure style={{margin : "1rem"}}>
      <iframe style={{width : "100%", height : "400px"}} src="${url}" />
      <figcaption style={{marginTop : "0px"}}>${
        video.caption[0]?.plain_text ? video.caption[0]?.plain_text : ''
      }</figcaption>
    </figure>
  `;
};

import fetch from 'node-fetch';
import { BlockMapType } from 'react-notion';

const headers = {
  Authorization: `Bearer ${process.env.NOTION_TOKEN_V2}`,
  'Content-Type': 'application/json',
};
//https://www.notion.so/anish-data/Post-8-19eb98020984805fa06ce00318f64cfa
export const getPageBlocks1 = async (pageId: string): Promise<BlockMapType> => {
  return await fetch(
    `http://127.0.0.1:8787/v1/page/19eb98020984805fa06ce00318f64cfa`,
    {
      headers: headers,
    },
  ).then((res) => res.json());
};

export const getPageBlocks = async (pageId: string): Promise<BlockMapType> => {
  return await fetch(`https://notion-api.splitbee.io/v1/page/${pageId}`).then(
    (res) => res.json(),
  );
};

export const getPageViews = async (path: string): Promise<number> => {
  const res = await fetch(
    `https://api.splitbee.io/public/timo.sh?path=${path}`,
  ).then((res) => res.json());
  return res.count || 0;
};

export const getDateStr = (date: Date | string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
};

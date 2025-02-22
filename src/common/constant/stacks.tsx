import { BsFillBootstrapFill, BsRobot, BsPlugin } from 'react-icons/bs';
import {
  SiJira,
  SiNotion,
  SiConfluence,
  SiCss3,
  SiJavascript,
  SiJquery,
  SiNextdotjs,
  SiPhp,
  SiPwa,
  SiStyledcomponents,
  SiTailwindcss,
  SiWordpress,
} from 'react-icons/si';

import { DiScrum } from 'react-icons/di';

export type stacksProps = {
  [key: string]: JSX.Element;
};

const iconSize = 20;

export const STACKS: stacksProps = {
  PHP: <SiPhp size={iconSize} className='text-blue-500' />,
  JavaScript: <SiJavascript size={iconSize} className='text-yellow-400' />,
  'Next.js': <SiNextdotjs size={iconSize} />,
  TailwindCSS: <SiTailwindcss size={iconSize} className='text-cyan-300' />,
  Bootstrap: (
    <BsFillBootstrapFill size={iconSize} className='text-purple-500' />
  ),
  'Chrome Plugins': <BsPlugin size={iconSize} className='text-purple-500' />,
  Notion: <SiNotion size={iconSize} />,
  Confluence: <SiConfluence size={iconSize} />,
  WordPress: <SiWordpress size={iconSize} />,
  'Artificial Intelligence': (
    <BsRobot size={iconSize} className='text-rose-500' />
  ),
  'Styled Components': (
    <SiStyledcomponents size={iconSize} className='text-pink-500' />
  ),
  PWA: <SiPwa size={iconSize} className='text-amber-600' />,
  Scrum: <DiScrum size={iconSize} />,
  Jquery: <SiJquery size={iconSize} />,
  Jira: <SiJira size={iconSize} className='text-red-500' />,
  CSS: <SiCss3 size={iconSize} className='text-blue-300' />,
};

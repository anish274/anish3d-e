import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

interface GiscusComment {
  isEnableReaction?: boolean;
}

const GiscusComment = ({ isEnableReaction = false }: GiscusComment) => {
  const { theme } = useTheme();

  return (
    <div className='mb-2 mt-5'>
      <Giscus
        repo='anish274/anish3d-e'
        repoId='R_kgDON6caqg'
        category='anish3d blog comments'
        categoryId='DIC_kwDON6caqs4CnUwq'
        mapping='pathname'
        reactionsEnabled={isEnableReaction ? '1' : '0'}
        emitMetadata='1'
        inputPosition='top'
        theme={theme === 'dark' ? 'transparent_dark' : 'light'}
        lang='en'
        loading='lazy'
      />
    </div>
  );
};

export default GiscusComment;

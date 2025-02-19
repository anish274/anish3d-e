const Introduction = () => {
  return (
    <section className='bg-cover bg-no-repeat '>
      <div className='space-y-3'>
        <div className='flex gap-2  text-2xl font-medium lg:text-3xl'>
          <h1>{process.env.NEXT_PUBLIC_HOME_PAGE_NAME}</h1>

          <div className='ml-1 animate-waving-hand'>👋</div>
        </div>
        <div className='space-y-4'>
          <ul className='ml-5 flex list-disc flex-col gap-1 text-neutral-700 dark:text-neutral-400 lg:flex-row lg:gap-10'>
            <li>{process.env.NEXT_PUBLIC_HOME_PAGE_LOCATION}</li>
            <li>{process.env.NEXT_PUBLIC_HOME_PAGE_WORKING}</li>
          </ul>
        </div>
      </div>

      <p
        id='user-desc'
        className='mt-6 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'
        dangerouslySetInnerHTML={{
          __html: process.env.NEXT_PUBLIC_HOME_PAGE_MY_DETAILS,
        }}
      />
    </section>
  );
};

export default Introduction;

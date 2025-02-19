const canonicalUrl = process.env.NEXT_PUBLIC_CANONICAL_URL;
const metaImage = 'https://cloud.aulianza.com/public/images/aulianza-id.png';
const metaDescription =
  'Seasoned Software Engineer especially in Frontend side, with a passion for creating pixel-perfect web experiences';

const defaultSEOConfig = {
  defaultTitle: process.env.NEXT_PUBLIC_FULL_NAME + ' - Personal Website',
  description: metaDescription,
  canonical: canonicalUrl,
  openGraph: {
    canonical: canonicalUrl,
    title: process.env.NEXT_PUBLIC_FULL_NAME + ' - Personal Website',
    description: metaDescription,
    type: 'website',
    images: [
      {
        url: metaImage,
        alt: process.env.NEXT_PUBLIC_ALT_URL + ' og-image',
        width: 800,
        height: 600,
      },
      {
        url: metaImage,
        alt: process.env.NEXT_PUBLIC_ALT_URL + ' og-image',
        width: 1200,
        height: 630,
      },
      {
        url: metaImage,
        alt: process.env.NEXT_PUBLIC_ALT_URL + ' og-image',
        width: 1600,
        height: 900,
      },
    ],
    site_name: process.env.NEXT_PUBLIC_ALT_URL,
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;

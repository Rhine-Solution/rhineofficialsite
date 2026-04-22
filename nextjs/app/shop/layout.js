export const metadata = {
  title: 'Tech Subscription Plans | Professional IT Support',
  description: 'Choose from Basic, Professional, or Enterprise IT subscription plans. Get ongoing tech support, maintenance, and managed services for your business.',
  openGraph: {
    title: 'Tech Subscription Plans | Rhine Solution',
    description: 'Choose from Basic, Professional, or Enterprise IT subscription plans. Get ongoing tech support for your business.',
    url: 'https://rhinesolution.com/shop',
    siteName: 'Rhine Solution',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
        width: 1200,
        height: 630,
        alt: 'Tech Subscription Plans',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Subscription Plans | Rhine Solution',
    description: 'Choose from Basic, Professional, or Enterprise IT subscription plans.',
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200'],
  },
  alternates: {
    canonical: 'https://rhinesolution.com/shop',
  },
}

export default function ShopLayout({ children }) {
  return children
}
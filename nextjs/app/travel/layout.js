export const metadata = {
  title: 'Travel Destinations | Book Your Next Adventure',
  description: 'Discover amazing travel destinations worldwide. Book your dream vacation with Rhine Solution - safe, secure, and unforgettable experiences.',
  openGraph: {
    title: 'Travel Destinations | Rhine Solution',
    description: 'Discover amazing travel destinations worldwide. Book your dream vacation.',
    url: 'https://rhinesolution.com/travel',
    siteName: 'Rhine Solution',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
        width: 1200,
        height: 630,
        alt: 'Travel Destinations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Destinations | Rhine Solution',
    description: 'Discover amazing travel destinations worldwide.',
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200'],
  },
  alternates: {
    canonical: 'https://rhinesolution.com/travel',
  },
}

export default function TravelLayout({ children }) {
  return children
}
export const metadata = {
  title: 'Contact Us | Get in Touch',
  description: 'Contact Rhine Solution for web development, IT support, and managed services. We respond within 24 hours.',
  openGraph: {
    title: 'Contact Us | Rhine Solution',
    description: 'Contact Rhine Solution for web development, IT support, and managed services.',
    url: 'https://rhinesolution.com/contact',
    siteName: 'Rhine Solution',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
        width: 1200,
        height: 630,
        alt: 'Contact Rhine Solution',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Rhine Solution',
    description: 'Get in touch for web development and IT support.',
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200'],
  },
  alternates: {
    canonical: 'https://rhinesolution.com/contact',
  },
}

export default function ContactLayout({ children }) {
  return children
}
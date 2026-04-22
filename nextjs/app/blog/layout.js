export const metadata = {
  title: 'Blog | Tech Insights & IT Best Practices',
  description: 'Expert insights, tutorials, and industry trends on web development, cloud computing, security, and IT best practices.',
  openGraph: {
    title: 'Blog | Tech Insights & IT Best Practices',
    description: 'Expert insights, tutorials, and industry trends on web development, cloud computing, and IT best practices.',
    url: 'https://rhinesolution.com/blog',
    siteName: 'Rhine Solution',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        width: 1200,
        height: 630,
        alt: 'Rhine Solution Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Tech Insights & IT Best Practices',
    description: 'Expert insights on web development, cloud computing, and IT best practices.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'],
  },
  alternates: {
    canonical: 'https://rhinesolution.com/blog',
  },
}

export default function BlogLayout({ children }) {
  return children
}
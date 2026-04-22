export const metadata = {
  title: 'Portfolio | Our Projects & Work',
  description: 'Explore our portfolio of web development, mobile apps, and tech projects. See what Rhine Solution has built for clients worldwide.',
  openGraph: {
    title: 'Portfolio | Rhine Solution',
    description: 'Explore our portfolio of web development and tech projects.',
    url: 'https://rhinesolution.com/portfolio',
    siteName: 'Rhine Solution',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        width: 1200,
        height: 630,
        alt: 'Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Rhine Solution',
    description: 'Explore our web development and tech projects.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'],
  },
  alternates: {
    canonical: 'https://rhinesolution.com/portfolio',
  },
}

export default function PortfolioLayout({ children }) {
  return children
}
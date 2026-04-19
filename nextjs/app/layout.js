import './globals.css'

export const metadata = {
  title: 'Sunny Travels - Book Your Dream Vacation',
  description: 'Find and book amazing travel destinations worldwide',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
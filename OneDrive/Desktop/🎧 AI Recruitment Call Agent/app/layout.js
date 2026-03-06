import './globals.css'

export const metadata = {
  title: 'AI Recruitment Dashboard',
  description: 'AI-powered recruitment call agent dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

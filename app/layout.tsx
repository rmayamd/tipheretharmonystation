import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NotificationContainer from '@/components/NotificationContainer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Tiphereth Center Cartagena | Dr. Ricardo Maya Romo - Bioingeniería Estética',
  description: 'Centro de medicina estética avanzada en Cartagena. Rinoplastia ultrasónica, contorno facial asiático (Park V-Line), rejuvenecimiento con Golden Ratio.',
  keywords: 'rinoplastia ultrasónica Cartagena, cirugía estética Cartagena, bioingeniería estética, medicina regenerativa, Dr Ricardo Maya',
  authors: [{ name: 'Dr. Ricardo Maya Romo', url: 'https://tipherethcenter.com' }],
  creator: 'Dr. Ricardo Maya Romo - Tiphereth Center',
  publisher: 'Tiphereth Center Cartagena',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://tipherethcenter.com',
    siteName: 'Tiphereth Center Cartagena',
    title: 'Tiphereth Center | Dr. Ricardo Maya Romo',
    description: 'Centro líder en medicina estética con tecnología IA.',
    images: [{ url: '/og-image-tipheret.jpg', width: 1200, height: 630 }]
  },
  alternates: { canonical: 'https://tipherethcenter.com' }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalBusiness',
              '@id': 'https://tipherethcenter.com',
              name: 'Tiphereth Center Cartagena',
              url: 'https://tipherethcenter.com',
              telephone: '+57-300-XXX-XXXX',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Cartagena, Bolívar',
                addressLocality: 'Cartagena',
                addressRegion: 'Bolívar',
                addressCountry: 'CO'
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '08:00',
                  closes: '18:00' // ✅ CORREGIDO: Sin comilla extra
                }
              ],
              priceRange: '$$$',
              founder: {
                '@type': 'Person',
                name: 'Dr. Ricardo Maya Romo',
                jobTitle: 'Médico Especialista en Medicina Estética'
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans h-full bg-slate-950 text-white antialiased`}>
        {children}
        <NotificationContainer />
      </body>
    </html>
  )
}
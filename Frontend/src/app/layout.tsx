'use client'
import '../styles/globals.css'
import Header from '../app/components/header/Header'
import Footer from '../app/components/footer/Footer'
import Main from '../app/components/main/Main'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </>
  )
}

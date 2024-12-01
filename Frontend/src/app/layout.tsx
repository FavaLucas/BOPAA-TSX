'use client';
import '../styles/globals.css';
import Header from '../app/components/header/Header';
import Footer from '../app/components/footer/Footer';


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>Empresas y Cotizaciones</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />

        {children}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
'use client';
import '../styles/globals.css';
import Header from '../app/components/header/Header';
import Footer from '../app/components/footer/Footer';
import Main from '../app/components/main/Main';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>BOPAA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />
        <Main />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;

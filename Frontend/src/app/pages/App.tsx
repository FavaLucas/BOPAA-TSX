import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';
import Main from '../components/main/Main';
import '../styles/globals.css';
import { AppProps } from 'next/app';


const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Header />
      <Main />
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default MyApp;

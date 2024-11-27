'use client';
import React from 'react';
import './pageHome.css';
import CotizacionesPage from '../../components/cotizaciones/cotizaciones';
import { Navbar } from '@/app/components/navbar';


const Home = () => {
  return (
    <div>
      <Navbar />
      <CotizacionesPage />
    </div>
  );
}

export default Home;
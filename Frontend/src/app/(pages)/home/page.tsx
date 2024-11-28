'use client';
import React from 'react';
import './pageHome.css';

import { Navbar } from '@/app/components/navbar';
import CotizacionesPage from '@/app/components/cotizaciones/cotizacionesNuevo';


const Home = () => {
  return (
    <div>
      <Navbar />
      <CotizacionesPage />
    </div>
  );
}

export default Home;
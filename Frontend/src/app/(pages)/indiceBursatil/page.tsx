  'use client';
  import React from 'react';
  import { Navbar } from '@/app/components/navbar/navbar';
  import BodyIndices from '@/app/components/bodyIndices/bodyIndices';




  const indiceBursatil = () => {
    return (
      <div>
        <Navbar botonRedireccion={"Cotizaciones"} url={"./home"}/>
        <BodyIndices />
      </div>
    );
  }

  export default indiceBursatil;